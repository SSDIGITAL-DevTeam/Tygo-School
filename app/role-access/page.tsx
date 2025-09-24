"use client";
import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import AdminTable, { AdminRow, SortDir, SortKey } from "../../components/AdminTable";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";

// Inter font for clear typography
const inter = Inter({ subsets: ["latin"] });

// Dummy data generator with the 4 required rows + more for pagination
function makeAdmins(): AdminRow[] {
  const seed: AdminRow[] = [
    { id: "a-1001", name: "Meijiko", email: "meijiko@gmail.com", role: "Admin", features: 6, status: "Active" },
    { id: "a-1002", name: "Ryan Kusuma", email: "ryan@gmail.com", role: "Secondary Admin", features: 4, status: "Active" },
    { id: "a-1003", name: "Heriyanto", email: "heriyanto@gmail.com", role: "Subjects and Teachers Admin", features: 4, status: "Non Active" },
    { id: "a-1004", name: "Imroatus", email: "imroatus@gmail.com", role: "Students Report Admin", features: 5, status: "Non Active" },
  ];
  const names = [
    "Dafa Aulia", "Citra Ayu", "Budi Santoso", "Fajar Ramadhan", "Gita Savitri",
    "Andi Wijaya", "Maya Fitri", "Rudi Hartono", "Dewi Lestari", "Rangga Saputra",
    "Intan Permata", "Joko Susilo", "Lutfi Kurnia", "Mawar Melati", "Naufal Rizky",
    "Agus Salim", "Siti Nurhaliza", "Doni Pratama", "Eka Putri", "Halim Perdana",
  ];
  const roles: AdminRow["role"][] = [
    "Admin",
    "Secondary Admin",
    "Subjects and Teachers Admin",
    "Students Report Admin",
  ];
  let i = 0;
  while (seed.length < 26) {
    const name = names[i % names.length];
    const role = roles[i % roles.length];
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
    const features = 3 + (i % 5);
    const status = i % 3 === 0 ? "Non Active" : "Active";
    seed.push({ id: `a-${2000 + i}`, name, email, role, features, status });
    i++;
  }
  return seed;
}

const RoleAccessPage: React.FC = () => {
  const router = useRouter();
  // Sidebar toggle for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [rows] = useState<AdminRow[]>(() => makeAdmins());

  // State: search, filters, sorting, pagination
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [filterRole, setFilterRole] = useState<AdminRow["role"] | "All Roles">("All Roles");
  const [filterStatus, setFilterStatus] = useState<AdminRow["status"] | "All Status">("All Status");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(4);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [queryInput]);

  // Sort handler toggles direction when clicking same column
  const onSortChange = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className={inter.className}>
      {/* Inline layout: fixed sidebar + spacer + content */}
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="w-64 shrink-0" aria-hidden />

        {/* Content column */}
        <div className="flex-1 min-h-screen relative z-0 bg-slate-100">
          <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((s) => !s)} />
          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header title */}
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              <span role="img" aria-label="users">👥</span> Role &amp; Access Management
            </h1>

            {/* Admin list card */}
            <AdminTable
              data={rows}
              query={query}
              filterRole={filterRole}
              filterStatus={filterStatus}
              sortKey={sortKey}
              sortDir={sortDir}
              page={page}
              pageSize={pageSize}
              onSortChange={onSortChange}
              onPageChange={setPage}
              onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
              onQueryChange={(q) => { setQueryInput(q); setPage(1); }}
              onFilterRoleChange={(r) => { setFilterRole(r); setPage(1); }}
              onFilterStatusChange={(s) => { setFilterStatus(s); setPage(1); }}
              onView={(row) => router.push(`/role-access/admin-list/${encodeURIComponent(row.id)}`)}
              onEdit={(row) => router.push(`/role-access/admin-list/${encodeURIComponent(row.id)}/edit`)}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default RoleAccessPage;
