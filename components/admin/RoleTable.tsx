"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Filter,
  Search,
  Download,
  Plus,
  ChevronUp,
  ChevronDown,
  Pencil,
  Eye,
} from "lucide-react";
import Pagination from "@/components/layout-global/Pagination";

type RoleRow = { name: string; features: number; status: "Active" | "Non Active" };
type SortKey = "name" | "features";
type SortDir = "asc" | "desc";
type Props = { data: RoleRow[] };

const RoleTable: React.FC<Props> = ({ data }) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Non Active">("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const handler = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (statusFilter !== "All") rows = rows.filter((row) => row.status === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter((row) => row.name.toLowerCase().includes(q));
    rows.sort((a, b) => {
      const left: any = a[sortKey];
      const right: any = b[sortKey];
      const cmp = typeof left === "number"
        ? left - right
        : String(left).localeCompare(String(right), undefined, { numeric: true });
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
    if (sortKey === key) setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const changeStatus = (value: "All" | "Active" | "Non Active") => {
    setStatusFilter(value);
    setFilterOpen(false);
    setPage(1);
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Role List</h2>
        <Link
          href="/role-access/role-management/add"
          className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-95 hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden />
          <span>Add Role</span>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
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
              <div className="absolute z-20 mt-2 w-40 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                {["All", "Active", "Non Active"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => changeStatus(status as typeof statusFilter)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm ${
                      statusFilter === status ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {status === "All" ? "All Status" : status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
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

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition active:scale-95 hover:bg-slate-50"
          onClick={() => console.log("Download roles")}
        >
          <Download className="h-4 w-4" aria-hidden />
          <span>Download Data</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-slate-800">
          <thead>
            <tr className="border-b border-slate-200">
              {[
                { key: "name", label: "Role Name" },
                { key: "features", label: "Accessible Features" },
                { key: "status", label: "Status" },
                { key: "action", label: "Action" },
              ].map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-3 font-semibold text-violet-700 ${col.key === "action" ? "text-center" : "text-left"}`}
                >
                  {col.key === "action" ? (
                    col.label
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key as SortKey)}
                      className="inline-flex items-center gap-1"
                    >
                      {col.label}
                      {sortKey === (col.key as SortKey)
                        ? sortDir === "asc"
                          ? <ChevronUp className="h-4 w-4" aria-hidden />
                          : <ChevronDown className="h-4 w-4" aria-hidden />
                        : <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden />}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={`${row.name}-${idx}`} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-3">{row.name}</td>
                <td className="px-3 py-3">{row.features} Features</td>
                <td className="px-3 py-3">
                  {row.status === "Active" ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
                      Non Active
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="rounded-md p-1 text-violet-700 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="rounded-md p-1 text-violet-700 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    >
                      <Eye className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination
          total={total}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </section>
  );
};

export default RoleTable;