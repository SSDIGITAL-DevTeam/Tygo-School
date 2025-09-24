"use client";
import React, { useMemo, useState } from "react";
import Pagination from "./Pagination";
import { Search, Download, ChevronDown, ChevronUp, Eye, Pencil, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export type SortKey = "name" | "email" | "role" | "features" | "status";
export type SortDir = "asc" | "desc";

export type AdminRow = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Secondary Admin" | "Subjects and Teachers Admin" | "Students Report Admin";
  features: number;
  status: "Active" | "Non Active";
};

export type AdminTableProps = {
  data: AdminRow[];
  query: string;
  filterRole: AdminRow["role"] | "All Roles";
  filterStatus: AdminRow["status"] | "All Status";
  sortKey: SortKey;
  sortDir: SortDir;
  page: number;
  pageSize: number;
  onSortChange: (key: SortKey) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onEdit?: (row: AdminRow) => void;
  onView?: (row: AdminRow) => void;
  // Additional helpers for controls
  onQueryChange?: (q: string) => void;
  onFilterRoleChange?: (r: AdminTableProps["filterRole"]) => void;
  onFilterStatusChange?: (s: AdminTableProps["filterStatus"]) => void;
};

// Utility: export current rows to CSV
function toCSV(rows: AdminRow[]) {
  const header = ["Admin Name", "Email", "Role Name", "Accessible Features", "Status"];
  const body = rows.map((r) => [r.name, r.email, r.role, r.features, r.status]);
  const csv = [header, ...body]
    .map((line) => line.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const dt = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const fname = `admins_${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}_${pad(dt.getHours())}${pad(dt.getMinutes())}.csv`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

const roles: (AdminRow["role"] | "All Roles")[] = [
  "All Roles",
  "Admin",
  "Secondary Admin",
  "Subjects and Teachers Admin",
  "Students Report Admin",
];

const statuses: (AdminRow["status"] | "All Status")[] = ["All Status", "Active", "Non Active"];

// Admin table with header controls, sorting, and pagination
const AdminTable: React.FC<AdminTableProps> = (props) => {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);

  // Pipeline: filter → search → sort → paginate
  const filtered = useMemo(() => {
    let rows = [...props.data];
    if (props.filterRole !== "All Roles") rows = rows.filter((r) => r.role === props.filterRole);
    if (props.filterStatus !== "All Status") rows = rows.filter((r) => r.status === props.filterStatus);
    const q = props.query.trim().toLowerCase();
    if (q) rows = rows.filter((r) => `${r.name} ${r.email}`.toLowerCase().includes(q));
    rows.sort((a, b) => {
      const key = props.sortKey;
      const va = a[key] as any;
      const vb = b[key] as any;
      let cmp = 0;
      if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return props.sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [props.data, props.filterRole, props.filterStatus, props.query, props.sortKey, props.sortDir]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / props.pageSize));
  const page = Math.min(props.page, pageCount);
  const paged = filtered.slice((page - 1) * props.pageSize, page * props.pageSize);

  const headerCell = (key: SortKey, label: string) => (
    <th key={key} className="text-left py-2 px-3">
      <button
        onClick={() => props.onSortChange(key)}
        aria-sort={props.sortKey === key ? (props.sortDir === "asc" ? "ascending" : "descending") : "none"}
        className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:underline"
        aria-label={`Sort by ${label}`}
      >
        <span>{label}</span>
        {props.sortKey === key ? (
          props.sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </button>
    </th>
  );

  return (
    <div className="rounded-2xl bg-white shadow-md border border-gray-200">
      {/* Card header: filter + search (left), actions (right) */}
      <div className="p-4 sm:p-5 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            {/* Filter button with popover */}
            <div className="relative">
              <button
                aria-haspopup="menu"
                aria-expanded={filterOpen}
                onClick={() => setFilterOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
              >
                <span>Filter</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {filterOpen && (
                <div role="menu" className="absolute z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-md p-3 space-y-3">
                  {/* Role group */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1">Role</div>
                    <select
                      aria-label="Filter by role"
                      value={props.filterRole}
                      onChange={(e) => props.onFilterRoleChange?.(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  {/* Status group */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1">Status</div>
                    <select
                      aria-label="Filter by status"
                      value={props.filterStatus}
                      onChange={(e) => props.onFilterStatusChange?.(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  aria-label="Search Here"
                  value={props.query}
                  onChange={(e) => props.onQueryChange?.(e.target.value)}
                  placeholder="Search Here"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                />
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:justify-end">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-[#6c2bd9] text-white px-3 py-2 text-sm font-semibold active:scale-[0.98] hover:bg-[#5a23b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6c2bd9]"
              aria-label="Add Admin"
              onClick={() => router.push("/role-access/add-admin")}
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Admin</span>
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
              aria-label="Download Data"
              onClick={() => toCSV(filtered)}
            >
              <Download className="w-4 h-4" />
              <span>Download Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 sm:p-5 overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr>
              {headerCell("name", "Admin Name")}
              {headerCell("email", "Email")}
              {headerCell("role", "Role Name")}
              {headerCell("features", "Accessible Features")}
              {headerCell("status", "Status")}
              <th className="text-left py-2 px-3 text-sm font-semibold text-violet-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, idx) => (
              <tr key={`${r.email}-${idx}`} className="hover:bg-slate-50">
                <td className="px-3 py-2 text-gray-800">{r.name}</td>
                <td className="px-3 py-2 text-gray-800">{r.email}</td>
                <td className="px-3 py-2 text-gray-800">{r.role}</td>
                <td className="px-3 py-2 text-gray-800">{r.features}</td>
                <td className="px-3 py-2">
                  {r.status === "Active" ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Active</span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">Non Active</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      aria-label={`View ${r.name}`}
                      onClick={() => {
                        if (props.onView) return props.onView(r);
                        router.push(`/role-access/admin-list/${encodeURIComponent(r.id)}`);
                      }}
                      className="p-2 rounded-md hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      <Eye className="w-4 h-4 text-[#6c2bd9]" />
                    </button>
                    <button
                      aria-label={`Edit ${r.name}`}
                      onClick={() => {
                        if (props.onEdit) return props.onEdit(r);
                        router.push(`/role-access/admin-list/${encodeURIComponent(r.id)}/edit`);
                      }}
                      className="p-2 rounded-md hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      <Pencil className="w-4 h-4 text-[#6c2bd9]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with page size + pagination */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-700 flex items-center gap-2">
          <span>Showing</span>
          <select
            aria-label="Rows per page"
            value={props.pageSize}
            onChange={(e) => props.onPageSizeChange?.(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
          >
            {[4, 10, 25].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>from {total} data</span>
        </div>
        <Pagination page={page} pageCount={pageCount} onPageChange={props.onPageChange} />
      </div>
    </div>
  );
};

export default AdminTable;
