"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, ChevronDown, ChevronUp } from "lucide-react";

import Pagination from "@/components/layout-global/Pagination";
import SearchInput from "@/components/layout-global/SearchInput";
import StatusFilter, { StatusValue } from "@/components/layout-global/StatusFilter";
import AddButton from "@/components/layout-global/AddButton";
import DownloadButton from "@/components/layout-global/DownloadButton";

export type RoleRow = {
  id: string;
  name: string;
  features: number;
  status: "Active" | "Non Active";
};

type SortKey = "name" | "features" | "status";
type SortDir = "asc" | "desc";
type Props = { data: RoleRow[] };

// CSV helper
const exportToCsv = (rows: RoleRow[]) => {
  const headers = ["Role Name", "Accessible Features", "Status"];
  const lines = rows.map((r) => [r.name, `${r.features}`, r.status]);
  const csv = [headers, ...lines]
    .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const d = new Date();
  const pad = (n: number) => `${n}`.padStart(2, "0");
  const name = `role-list_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(
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

const RoleTable: React.FC<Props> = ({ data }) => {
  // state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  // pipe
  const filtered = useMemo(() => {
    let rows = [...data];
    if (statusFilter !== "All") rows = rows.filter((row) => row.status === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter((row) => row.name.toLowerCase().includes(q));
    rows.sort((a, b) => {
      const left: any = a[sortKey];
      const right: any = b[sortKey];
      const cmp =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [data, query, sortDir, sortKey, statusFilter]);

  // pagination
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize]
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
      {/* Header + Add */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Role List</h2>
        <AddButton href="admin/role-access/role-management/add-role" label="Add Role" ariaLabel="Add Role" />
      </div>

      {/* Toolbar: Filter + Search + Download */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <StatusFilter
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            // options default: ["All", "Active", "Non Active"]
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

        <DownloadButton
          label="Download Data"
          onClick={() => exportToCsv(filtered)}
        />
      </div>

      {/* Table */}
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
                      {sortKey === (col.key as SortKey) ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="h-4 w-4" aria-hidden />
                        ) : (
                          <ChevronDown className="h-4 w-4" aria-hidden />
                        )
                      ) : (
                        <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden />
                      )}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paged.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
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
                    <Link
                      href={`/role-access/role-management/edit/${encodeURIComponent(row.id)}`}
                      aria-label={`Edit role ${row.name}`}
                      className="rounded-md p-1 text-violet-700 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href={`/role-access/role-management/detail/${encodeURIComponent(row.id)}`}
                      aria-label={`View role ${row.name}`}
                      className="rounded-md p-1 text-violet-700 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    >
                      <Eye className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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