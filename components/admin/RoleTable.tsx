"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  // filters / search / sort / page
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Non Active">("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // state pagination untuk komponen Pagination reusable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  // filter popover
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!filterOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [filterOpen]);

  // derive rows
  const filtered = useMemo(() => {
    let rows = [...data];
    if (statusFilter !== "All") rows = rows.filter((r) => r.status === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    rows.sort((a, b) => {
      const va: any = a[sortKey];
      const vb: any = b[sortKey];
      const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [data, query, statusFilter, sortKey, sortDir]);

  // pagination (hanya logic data slice, UI pakai <Pagination />)
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };
  const changeStatus = (v: "All" | "Active" | "Non Active") => {
    setStatusFilter(v); setFilterOpen(false); setPage(1);
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
      {/* Header title + Add Role */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Role List</h2>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-95 hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          onClick={() => console.log("Add role clicked")}
        >
          <Plus className="h-4 w-4" />
          <span>Add Role</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              <Filter className="h-4 w-4 text-slate-500" />
              <span>Filter</span>
            </button>
            {filterOpen && (
              <div className="absolute z-20 mt-2 w-40 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                {["All", "Active", "Non Active"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => changeStatus(v as typeof statusFilter)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm ${
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
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search Here"
              className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={() => console.log("Download roles")}
        >
          <Download className="h-4 w-4" />
          <span>Download Data</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-slate-800">
          <thead>
            <tr className="border-b border-slate-200">
              {[
                { key: "name", label: "Role Name" },
                { key: "features", label: "Accessible Features" },
                { key: "status" as const, label: "Status" },
                { key: "action" as const, label: "Action" },
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
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />
                        : <ChevronUp className="h-4 w-4 text-slate-400" />}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
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
                      className="rounded-md p-1 text-violet-700 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-md p-1 text-violet-700 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: cukup render Pagination reusable */}
      <div className="mt-6">
        <Pagination
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setPage(1); // reset saat page size berubah
          }}
        />
      </div>
    </section>
  );
};

export default RoleTable;
