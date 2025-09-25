"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import Sidebar from "../../../../components/admin/Sidebar";
import Header from "../../../../components/layout-global/Header";
import Pagination from "../../../../components/layout-global/Pagination";
import StatusBadge from "../../../../components/layout-global/StatusBadge";
import EditAction from "@/components/layout-global/EditAction";
import ViewAction from "@/components/layout-global/ViewAction";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Filter,
  GraduationCap,
  PenSquare,
  Plus,
  Search,
  X,
} from "lucide-react";
import { getClassList, ClassRecord, CLASS_STATUS_FILTERS } from "./class-data";
import AddButton from "@/components/layout-global/AddButton";

const inter = Inter({ subsets: ["latin"] });

type ClassRow = ClassRecord;
type SortableKey = keyof ClassRow;

type SortState = {
  key: SortableKey;
  direction: "asc" | "desc";
};

type ColumnConfig = {
  key: SortableKey | "action";
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
};

const columns: ColumnConfig[] = [
  { key: "name", label: "Class Name", sortable: true },
  { key: "homeroomTeacher", label: "Homeroom Teacher", sortable: true },
  {
    key: "capacity",
    label: "Class Capacity",
    sortable: true,
    align: "center",
  },
  {
    key: "totalStudents",
    label: "Total Students",
    sortable: true,
    align: "center",
  },
  {
    key: "totalSubjects",
    label: "Total Subjects",
    sortable: true,
    align: "center",
  },
  { key: "status", label: "Status", sortable: true, align: "center" },
  { key: "action", label: "Action", align: "center" },
];

const ClassManagementPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    (typeof CLASS_STATUS_FILTERS)[number]
  >(CLASS_STATUS_FILTERS[0]);
  const [showFilter, setShowFilter] = useState(false);
  const [pageSize, setPageSize] = useState(4);
  const [page, setPage] = useState(2);
  const [sort, setSort] = useState<SortState>({
    key: "name",
    direction: "asc",
  });

  const classes = useMemo(() => getClassList(), []);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredClasses = useMemo(() => {
    return classes.filter((row) => {
      if (statusFilter !== "All" && row.status !== statusFilter) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const capacityLabel =
        row.capacity === null ? "undefined" : row.capacity.toString();
      const haystack =
        `${row.name} ${row.homeroomTeacher} ${capacityLabel} ${row.totalStudents} ${row.totalSubjects} ${row.status}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [classes, statusFilter, normalizedQuery]);

  const sortedClasses = useMemo(() => {
    const copy = [...filteredClasses];
    copy.sort((a, b) => {
      const { key, direction } = sort;
      const dir = direction === "asc" ? 1 : -1;

      const valueFor = (row: ClassRow) => {
        const value = row[key];
        if (value === null) {
          return direction === "asc"
            ? Number.POSITIVE_INFINITY
            : Number.NEGATIVE_INFINITY;
        }
        return value;
      };

      const va = valueFor(a);
      const vb = valueFor(b);

      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * dir;
      }

      return (
        String(va).localeCompare(String(vb), undefined, {
          sensitivity: "base",
          numeric: true,
        }) * dir
      );
    });
    return copy;
  }, [filteredClasses, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedClasses.length / pageSize));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const startIndex = (page - 1) * pageSize;
  const visibleRows = sortedClasses.slice(startIndex, startIndex + pageSize);
  const totalCount = sortedClasses.length;

  const handleSort = useCallback((key: SortableKey) => {
    setSort((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
    setPage(1);
  }, []);

  const handleStatusSelect = useCallback(
    (value: (typeof CLASS_STATUS_FILTERS)[number]) => {
      setStatusFilter(value);
      setPage(1);
      setShowFilter(false);
    },
    []
  );

  const router = useRouter();
  const CLASSES_BASE = "/admin/master-data/classes";

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <main className="md:ml-64 p-4 md:p-6 lg:p-8">
            <nav className="mb-5 text-sm text-gray-500" aria-label="Breadcrumb">
              <span className="text-gray-400">Master Data</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">
                Manage Classes
              </span>
            </nav>

            {/* Header kecil seperti di halaman Subjects */}
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-[#f3e8ff] text-[#6c2bd9]">
                  <GraduationCap className="h-7 w-7" />
                </span>
                <h1 className="text-lg font-semibold text-gray-900">
                  Manage Classes
                </h1>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="space-y-6 px-6 pb-6 pt-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Class List
                  </h2>
                  <div className="flex flex-col gap-3 sm:flex-row">

                    <div className="flex justify-end">
                      <AddButton entity="Class" href="/admin/master-data/classes/add-class" />
                      {/* Renders: “Add Role” with the purple pill styling */}
                    </div>
                  </div>
                </div>

                {/* Baris filter + search + download */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                    {/* ...blok filter kamu tetap... */}
                    <div className="relative w-full md:w-80">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setPage(1);
                        }}
                        placeholder="Search here"
                        className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                        aria-label="Search classes"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex flex-nowrap items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    <span className="whitespace-nowrap">Download Data</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-[#f8f8ff]">
                      <tr>
                        {columns.map((column) => {
                          if (column.key === "action") {
                            return (
                              <th
                                key={column.key}
                                scope="col"
                                className="px-3 py-3 text-center text-sm font-semibold text-[#5b21b6]"
                              >
                                {column.label}
                              </th>
                            );
                          }

                          const align =
                            column.align === "center"
                              ? "text-center"
                              : column.align === "right"
                                ? "text-right"
                                : "text-left";

                          return (
                            <th
                              key={column.key}
                              scope="col"
                              className={`px-3 py-3 text-sm font-semibold text-[#5b21b6] ${align}`}
                            >
                              {column.sortable ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSort(column.key as SortableKey)
                                  }
                                  className="inline-flex items-center gap-2 text-[#5b21b6] hover:underline"
                                >
                                  <span>{column.label}</span>
                                  {sort.key === column.key ? (
                                    sort.direction === "asc" ? (
                                      <ChevronUp className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    )
                                  ) : (
                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              ) : (
                                <span>{column.label}</span>
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {visibleRows.map((row) => {
                        const capacityLabel =
                          row.capacity === null
                            ? "Undefined"
                            : row.capacity.toString();
                        return (
                          <tr
                            key={`${row.name}-${row.homeroomTeacher}`}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-3 py-3 text-sm text-gray-800">
                              {row.name}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-800">
                              {row.homeroomTeacher}
                            </td>
                            <td className="px-3 py-3 text-center text-sm text-gray-800">
                              {capacityLabel}
                            </td>
                            <td className="px-3 py-3 text-center text-sm text-gray-800">
                              {row.totalStudents}
                            </td>
                            <td className="px-3 py-3 text-center text-sm text-gray-800">
                              {row.totalSubjects}
                            </td>
                            <td className="px-3 py-3 text-center text-sm">
                              <StatusBadge status={row.status} />
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <EditAction
                                  href={`${CLASSES_BASE}/${encodeURIComponent(row.name)}/edit`}
                                  title={`Edit ${row.name}`}
                                />

                                {/* Kanan: View -> /admin/master-data/classes/class-detail?name={name} */}
                                <ViewAction
                                  href={`${CLASSES_BASE}/class-detail?name=${encodeURIComponent(row.name)}`}
                                  title={`View ${row.name}`}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {visibleRows.length === 0 && (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="py-12 text-center text-sm text-gray-500"
                          >
                            No classes match the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>Showing</span>
                    <select
                      value={pageSize}
                      onChange={(event) => {
                        setPageSize(Number(event.target.value));
                        setPage(1);
                      }}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                    >
                      {[4, 10, 25].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span>from {totalCount} data</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Pagination
                      page={page}
                      pageCount={pageCount}
                      onPageChange={setPage}
                    />
                    <button
                      type="button"
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-[#6c2bd9] transition hover:bg-purple-50"
                    >
                      Go {">>"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClassManagementPage;
