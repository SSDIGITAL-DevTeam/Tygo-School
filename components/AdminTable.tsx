"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Filter,
  Search,
  Download,
  UserPlus,
  ArrowUpDown,
  Eye,
  Pencil,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
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

// Utility to export current list to CSV file
const exportToCsv = (rows: AdminRow[]) => {
  const headers = ["Admin Name", "Email", "Role Name", "Accessible Features", "Status"];
  const lines = rows.map((row) => [row.name, row.email, row.role, `${row.features}`, row.status]);
  const csv = [headers, ...lines]
    .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const timestamp = new Date();
  const pad = (v: number) => `${v}`.padStart(2, "0");
  const fileName = `admin-list_${timestamp.getFullYear()}${pad(timestamp.getMonth() + 1)}${pad(timestamp.getDate())}_${pad(
    timestamp.getHours(),
  )}${pad(timestamp.getMinutes())}.csv`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const AdminTable: React.FC<AdminTableProps> = ({ data }) => {
  // Filter, search, sort & pagination state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Non Active">("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(4);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    if (!filterOpen) return;
    const handler = (event: MouseEvent) => {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(event.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  // Derived dataset after filter, search, sort
  const filtered = useMemo(() => {
    let rows = [...data];
    if (statusFilter !== "All") rows = rows.filter((row) => row.status === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter((row) => `${row.name} ${row.email}`.toLowerCase().includes(q));
    rows.sort((a, b) => {
      const left = a[sortKey] as unknown;
      const right = b[sortKey] as unknown;
      let comparison = 0;
      if (typeof left === "number" && typeof right === "number") comparison = left - right;
      else comparison = String(left).localeCompare(String(right), undefined, { numeric: true });
      return sortDir === "asc" ? comparison : -comparison;
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
    if (sortKey === key) setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const changeStatusFilter = (value: "All" | "Active" | "Non Active") => {
    setStatusFilter(value);
    setFilterOpen(false);
    setPage(1);
  };

  const paginationItems = useMemo(() => {
    const numbers: number[] = [];
    numbers.push(1);
    for (let i = currentPage - 1; i <= currentPage + 1; i += 1) if (i > 1 && i < pageCount) numbers.push(i);
    if (pageCount > 1) numbers.push(pageCount);
    const unique = Array.from(new Set(numbers)).sort((a, b) => a - b);
    const items: (number | "ellipsis")[] = [];
    unique.forEach((num, idx) => {
      const previous = unique[idx - 1];
      if (idx > 0 && previous !== undefined && num - previous > 1) items.push("ellipsis");
      items.push(num);
    });
    return items;
  }, [currentPage, pageCount]);

  const goToPage = (next: number) => {
    const target = Math.min(Math.max(1, next), pageCount);
    setPage(target);
  };

  const statusOptions: ("All" | "Active" | "Non Active")[] = ["All", "Active", "Non Active"];

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
      {/* Toolbar with filter, search, actions */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition active:scale-95 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              <Filter className="h-4 w-4 text-slate-500" aria-hidden />
              <span>Filter</span>
            </button>
            {filterOpen && (
              <div role="menu" className="absolute z-30 mt-2 w-40 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                {statusOptions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => changeStatusFilter(value)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                      statusFilter === value ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{value === "All" ? "All Status" : value}</span>
                    {statusFilter === value && <span className="text-xs font-semibold">Selected</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              role="searchbox"
              aria-label="Search Here"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search Here"
              className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:justify-end">
          <Link
            href="/role-access/admin-list/add-admin"
            className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-95 hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            <span>Add Admin</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition active:scale-95 hover:bg-slate-50"
            aria-label="Download Data"
            onClick={() => exportToCsv(filtered)}
          >
            <Download className="h-4 w-4" aria-hidden />
            <span>Download Data</span>
          </button>
        </div>
      </div>

      {/* Admin list table */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-slate-800">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button
                  type="button"
                  onClick={() => toggleSort("name")}
                  aria-label="Sort by admin name"
                  className="inline-flex items-center gap-2"
                >
                  <span>Admin Name</span>
                  <ArrowUpDown className={`h-4 w-4 ${sortKey === "name" ? "text-violet-600" : "text-slate-400"}`} aria-hidden />
                </button>
              </th>
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <span>Email</span>
              </th>
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button
                  type="button"
                  onClick={() => toggleSort("role")}
                  aria-label="Sort by role name"
                  className="inline-flex items-center gap-2"
                >
                  <span>Role Name</span>
                  <ArrowUpDown className={`h-4 w-4 ${sortKey === "role" ? "text-violet-600" : "text-slate-400"}`} aria-hidden />
                </button>
              </th>
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button
                  type="button"
                  onClick={() => toggleSort("features")}
                  aria-label="Sort by accessible features"
                  className="inline-flex items-center gap-2"
                >
                  <span>Accessible Features</span>
                  <ArrowUpDown className={`h-4 w-4 ${sortKey === "features" ? "text-violet-600" : "text-slate-400"}`} aria-hidden />
                </button>
              </th>
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">
                <button
                  type="button"
                  onClick={() => toggleSort("status")}
                  aria-label="Sort by status"
                  className="inline-flex items-center gap-2"
                >
                  <span>Status</span>
                  <ArrowUpDown className={`h-4 w-4 ${sortKey === "status" ? "text-violet-600" : "text-slate-400"}`} aria-hidden />
                </button>
              </th>
              <th className="px-2 py-3 text-left font-semibold text-violet-700 md:px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-2 py-3 text-slate-800 md:px-3">{row.name}</td>
                <td className="px-2 py-3 text-slate-800 md:px-3">{row.email}</td>
                <td className="px-2 py-3 text-slate-800 md:px-3">{row.role}</td>
                <td className="px-2 py-3 text-slate-800 md:px-3">{row.features} Features</td>
                <td className="px-2 py-3 md:px-3">
                  {row.status === "Active" ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Active</span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">Non Active</span>
                  )}
                </td>
                <td className="px-2 py-3 md:px-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/role-access/admin-list/${encodeURIComponent(row.id)}`}
                      aria-label={`View admin ${row.name}`}
                      className="rounded-md p-1 text-violet-700 transition hover:bg-violet-50 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                      <Eye className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href={`/role-access/admin-list/${encodeURIComponent(row.id)}/edit`}
                      aria-label={`Edit admin ${row.name}`}
                      className="rounded-md p-1 text-violet-700 transition hover:bg-violet-50 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table footer with page size & pagination */}
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
