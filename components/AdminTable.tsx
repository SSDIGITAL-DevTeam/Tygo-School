"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Filter,
  Search,
  Download,
  UserPlus,
  Eye,
  Pencil,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

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

type AdminTableProps = {
  data: AdminRow[];
};

// CSV helper
const exportToCsv = (rows: AdminRow[]) => {
  const headers = ["Admin Name", "Email", "Role Name", "Accessible Features", "Status"];
  const lines = rows.map((r) => [r.name, r.email, r.role, `${r.features}`, r.status]);
  const csv = [headers, ...lines].map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const d = new Date();
  const pad = (n: number) => `${n}`.padStart(2, "0");
  const name = `admin-list_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}.csv`;
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
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Non Active">("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(4);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  // close popover outside
  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

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

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const goToPage = (n: number) => setPage(Math.min(Math.max(1, n), pageCount));

  // ✅ paginationItems yang hilang — ditambahkan lagi
  const paginationItems = useMemo(() => {
    const numbers: number[] = [];
    numbers.push(1);
    for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
      if (i > 1 && i < pageCount) numbers.push(i);
    }
    if (pageCount > 1) numbers.push(pageCount);
    const unique = Array.from(new Set(numbers)).sort((a, b) => a - b);
    const items: (number | "ellipsis")[] = [];
    unique.forEach((num, idx) => {
      const prev = unique[idx - 1];
      if (idx > 0 && prev !== undefined && num - prev > 1) items.push("ellipsis");
      items.push(num);
    });
    return items;
  }, [currentPage, pageCount]);

  const statusOptions: ("All" | "Active" | "Non Active")[] = ["All", "Active", "Non Active"];

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
      {/* Header row: title + actions*/}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Admin List</h2>
        <div className="flex items-center gap-3">
          <Link
            href="/role-access/admin-list/add-admin"
            className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => exportToCsv(filtered)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            <span>Download Data</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Filter + Search */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Filter className="h-4 w-4 text-slate-500" />
              <span>Filter</span>
            </button>
            {filterOpen && (
              <div role="menu" className="absolute z-30 mt-2 w-40 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                {statusOptions.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setStatusFilter(v);
                      setFilterOpen(false);
                      setPage(1);
                    }}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                      statusFilter === v ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {v === "All" ? "All Status" : v}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search Here"
              className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-slate-800">
          <thead>
            <tr className="border-b border-slate-200">
              {/* Admin Name */}
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button type="button" onClick={() => toggleSort("name")} className="inline-flex items-center gap-1">
                  <span>Admin Name</span>
                  {sortKey === "name" ? (
                    sortDir === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </th>

              {/* Email (no sort) */}
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">Email</th>

              {/* Role Name */}
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button type="button" onClick={() => toggleSort("role")} className="inline-flex items-center gap-1">
                  <span>Role Name</span>
                  {sortKey === "role" ? (
                    sortDir === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </th>

              {/* Accessible Features */}
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button type="button" onClick={() => toggleSort("features")} className="inline-flex items-center gap-1">
                  <span>Accessible Features</span>
                  {sortKey === "features" ? (
                    sortDir === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </th>

              {/* Status */}
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button type="button" onClick={() => toggleSort("status")} className="inline-flex items-center gap-1">
                  <span>Status</span>
                  {sortKey === "status" ? (
                    sortDir === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </th>

              {/* Action */}
              <th className="px-2 py-3 text-center font-semibold text-violet-700 md:px-3">Action</th>
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

      {/* Table footer with page size & pagination (tidak diubah) */}
      <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Showing</span>
          <select
            aria-label="Rows per page"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="h-8 rounded-md border border-slate-300 px-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            {[4, 10, 25].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>from {total} data</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              aria-label="First page"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="min-w-[32px] h-8 rounded-md border border-slate-300 bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronsLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Previous page"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="min-w-[32px] h-8 rounded-md border border-slate-300 bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            {paginationItems.map((item, idx) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-current={item === currentPage ? "page" : undefined}
                  onClick={() => goToPage(item)}
                  className={`min-w-[32px] h-8 rounded-full border px-3 transition ${
                    item === currentPage
                      ? "border-transparent bg-violet-700 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}
            <button
              type="button"
              aria-label="Next page"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="min-w-[32px] h-8 rounded-md border border-slate-300 bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Last page"
              onClick={() => goToPage(pageCount)}
              disabled={currentPage === pageCount}
              className="min-w-[32px] h-8 rounded-md border border-slate-300 bg-white px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronsRight className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <input
              type="text"
              inputMode="numeric"
              disabled
              className="h-8 w-12 rounded-md border border-slate-300 bg-slate-100 text-center text-sm"
              value="--"
              aria-label="Go to page"
            />
            <span className="inline-flex items-center gap-1 font-medium text-slate-600">
              Go
              <ChevronsRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminTable;
