"use client";
import React, { useMemo, useState } from "react";
import Pagination from "./Pagination";
import { Search, Download, ChevronDown, Pencil, Eye, ArrowUpDown, Filter } from "lucide-react";

type RoleRow = { name: string; features: number; status: "Active" | "Non Active" };
type SortKey = "name" | "features" | "status";
type SortDir = "asc" | "desc";

type Props = { data: RoleRow[] };

const RoleTable: React.FC<Props> = ({ data }) => {
  // Filters & state
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(4);
  const [filterOpen, setFilterOpen] = useState(false);

  // Pipeline: filter → search → sort → paginate
  const filtered = useMemo(() => {
    let rows = [...data];
    if (filterStatus !== "All Status") rows = rows.filter((r) => r.status === (filterStatus as any));
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    rows.sort((a, b) => {
      const va: any = a[sortKey];
      const vb: any = b[sortKey];
      let cmp = 0;
      if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [data, filterStatus, query, sortKey, sortDir]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount);
  const paged = filtered.slice((current - 1) * pageSize, current * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md border border-gray-200">
      {/* Card top controls: Filter + Search on left, actions on right */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={filterOpen}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {filterOpen && (
              <div role="menu" className="absolute z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-md p-3">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                <select
                  aria-label="Filter by status"
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                >
                  {['All Status','Active','Non Active'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              aria-label="Search Here"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search Here"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
            />
          </div>
        </div>
        {/* Right actions */}
        <div className="flex items-center gap-2 sm:justify-end">
          <button className="inline-flex items-center rounded-md bg-violet-700 px-4 py-2 text-white font-semibold hover:bg-violet-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-700" aria-label="Add role" onClick={() => console.log("Add Role clicked")}>+ Add Role</button>
          <button className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]" aria-label="Download Data" onClick={() => console.log("Download roles")}> <Download className="w-4 h-4 mr-2"/> Download Data</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 text-sm font-semibold text-violet-700">
                <button onClick={() => toggleSort('name')} aria-label="Sort by role name" className="inline-flex items-center gap-1">Role Name <ArrowUpDown className="w-3.5 h-3.5"/></button>
              </th>
              <th className="text-left py-2 px-3 text-sm font-semibold text-violet-700">
                <button onClick={() => toggleSort('features')} aria-label="Sort by features" className="inline-flex items-center gap-1">Accessible Features <ArrowUpDown className="w-3.5 h-3.5"/></button>
              </th>
              <th className="text-left py-2 px-3 text-sm font-semibold text-violet-700">
                <button onClick={() => toggleSort('status')} aria-label="Sort by status" className="inline-flex items-center gap-1">Status <ArrowUpDown className="w-3.5 h-3.5"/></button>
              </th>
              <th className="text-left py-2 px-3 text-sm font-semibold text-violet-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, idx) => (
              <tr key={`${r.name}-${idx}`} className="hover:bg-slate-50">
                <td className="px-3 py-2 text-gray-800">{r.name}</td>
                <td className="px-3 py-2 text-gray-800">{r.features} Features</td>
                <td className="px-3 py-2">
                  {r.status === 'Active' ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Active</span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">Non Active</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button aria-label="Edit role" className="p-2 rounded-md hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]" onClick={() => console.log('Edit', r)}>
                      <Pencil className="w-4 h-4 text-[#6c2bd9]"/>
                    </button>
                    <button aria-label="View role" className="p-2 rounded-md hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]" onClick={() => console.log('View', r)}>
                      <Eye className="w-4 h-4 text-[#6c2bd9]"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-700 flex items-center gap-2">
          <span>Showing</span>
          <select aria-label="Rows per page" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]">
            {[4,10,25].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>from {total} data</span>
        </div>
        <Pagination page={current} pageCount={pageCount} onPageChange={setPage}/>
      </div>
    </section>
  );
};

export default RoleTable;

