"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, ChevronUp, ChevronDown } from "lucide-react";

import Pagination from "@/components/layout-global/Pagination";
import SearchInput from "@/components/layout-global/SearchInput";
import StatusFilter, { StatusValue } from "@/components/layout-global/StatusFilter";
import AddButton from "@/components/layout-global/AddButton";
import DownloadButton from "@/components/layout-global/DownloadButton";

export type SortKey = "name" | "email" | "role" | "features" | "status";
export type SortDir = "asc" | "desc";

export type AdminRow = {
  id: string;
  name: string;
  email: string;
  role:
    | "Admin"
    | "Secondary Admin"
    | "Subjects and Teachers Admin"
    | "Students Report Admin";
  features: number;
  status: "Active" | "Non Active";
};

type AdminTableProps = {
  data: AdminRow[];
};

// CSV helper
const exportToCsv = (rows: AdminRow[]) => {
  const headers = ["Admin Name", "Email", "Role Name", "Accessible Features", "Status"];
  const lines = rows.map((r) => [r.name, r.email, r.role, `${r.features}`, r.status]);
  const csv = [headers, ...lines]
    .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const d = new Date();
  const pad = (n: number) => `${n}`.padStart(2, "0");
  const name = `admin-list_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(
    d.getHours()
  )}${pad(d.getMinutes())}.csv`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const AdminTable: React.FC<AdminTableProps> = ({ data }) => {
  // state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  // pipe
  const filtered = useMemo(() => {
    let rows = [...data];
    if (statusFilter !== "All") rows = rows.filter((r) => r.status === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter((r) => `${r.name} ${r.email}`.toLowerCase().includes(q));
    rows.sort((a, b) => {
      const va = a[sortKey] as any;
      const vb = b[sortKey] as any;
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [data, query, sortKey, sortDir, statusFilter]);

  // paginate data untuk tabel
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const paged = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize]
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
      {/* Header row: title + Add Admin (pakai AddButton) */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Admin List</h2>
        <AddButton
          href="/role-access/admin-list/add-admin"
          label="Add Admin"
          ariaLabel="Add Admin"
        />
      </div>

      {/* Toolbar: StatusFilter + SearchInput (kiri) & DownloadButton (kanan) */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <StatusFilter
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          />
          <SearchInput
            value={query}
            onChange={(val) => {
              setQuery(val);
              setPage(1);
            }}
            placeholder="Search Here"
          />
        </div>

        <div className="flex items-center">
          <DownloadButton
            label="Download Data"
            onClick={() => exportToCsv(filtered)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-slate-800">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button
                  type="button"
                  onClick={() => toggleSort("name")}
                  className="inline-flex items-center gap-1"
                >
                  <span>Admin Name</span>
                  {sortKey === "name" ? (
                    sortDir === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                Email
              </th>
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button
                  type="button"
                  onClick={() => toggleSort("role")}
                  className="inline-flex items-center gap-1"
                >
                  <span>Role Name</span>
                  {sortKey === "role" ? (
                    sortDir === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button
                  type="button"
                  onClick={() => toggleSort("features")}
                  className="inline-flex items-center gap-1"
                >
                  <span>Accessible Features</span>
                  {sortKey === "features" ? (
                    sortDir === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button
                  type="button"
                  onClick={() => toggleSort("status")}
                  className="inline-flex items-center gap-1"
                >
                  <span>Status</span>
                  {sortKey === "status" ? (
                    sortDir === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="px-2 py-3 text-center font-semibold text-violet-700 md:px-3">
                Action
              </th>
            </tr>
          </thead>

            <tbody>
              {paged.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-2 py-3 md:px-3">{row.name}</td>
                  <td className="px-2 py-3 md:px-3">{row.email}</td>
                  <td className="px-2 py-3 md:px-3">{row.role}</td>
                  <td className="px-2 py-3 md:px-3">{row.features} Features</td>
                  <td className="px-2 py-3 md:px-3">
                    {row.status === "Active" ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-600/20">
                        Non Active
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-3 md:px-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/role-access/admin-list/${encodeURIComponent(row.id)}`}
                        aria-label={`View ${row.name}`}
                        className="rounded-md p-1 text-violet-700 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/role-access/admin-list/${encodeURIComponent(row.id)}/edit`}
                        aria-label={`Edit ${row.name}`}
                        className="rounded-md p-1 text-violet-700 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

      {/* Footer: komponen Pagination reusable */}
      <div className="mt-6 pt-4">
        <Pagination
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setPage(1);
          }}
        />
      </div>
    </section>
  );
};

export default AdminTable;
