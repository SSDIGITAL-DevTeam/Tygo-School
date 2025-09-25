"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import Header from "../../../../components/Header";
import Pagination from "../../../../components/Pagination";
import StatusBadge from "../../../../components/StatusBadge";
import {
  ArrowUpDown,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Filter,
  PenSquare,
  Plus,
  Search,
  X,
} from "lucide-react";
import {
  getSubjectList,
  SubjectRecord,
  SUBJECT_STATUS_FILTERS,
} from "./subject-data";

const inter = Inter({ subsets: ["latin"] });

type SubjectRow = SubjectRecord;
type SortableKey = keyof SubjectRow;

type SortState = {
  key: SortableKey;
  direction: "asc" | "desc";
};

const columns: Array<{
  key: SortableKey | "status" | "action";
  label: string;
  sortable?: boolean;
}> = [
  { key: "code", label: "Subject Code", sortable: true },
  { key: "name", label: "Subject Name", sortable: true },
  { key: "description", label: "Description", sortable: true },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

const SubjectManagementPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    (typeof SUBJECT_STATUS_FILTERS)[number]
  >(SUBJECT_STATUS_FILTERS[0]);
  const [showFilter, setShowFilter] = useState(false);
  const [pageSize, setPageSize] = useState(4);
  const [page, setPage] = useState(2);
  const [sort, setSort] = useState<SortState>({
    key: "code",
    direction: "asc",
  });

  const router = useRouter();

  const subjects = useMemo(() => getSubjectList(), []);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredSubjects = useMemo(() => {
    return subjects.filter((row) => {
      if (statusFilter !== "All" && row.status !== statusFilter) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const haystack =
        `${row.code} ${row.name} ${row.description}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [subjects, statusFilter, normalizedQuery]);

  const sortedSubjects = useMemo(() => {
    const copy = [...filteredSubjects];
    copy.sort((a, b) => {
      const { key, direction } = sort;
      const va = a[key];
      const vb = b[key];
      const comparison = String(va).localeCompare(String(vb), undefined, {
        numeric: key === "code",
        sensitivity: "base",
      });
      return direction === "asc" ? comparison : -comparison;
    });
    return copy;
  }, [filteredSubjects, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedSubjects.length / pageSize));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const startIndex = (page - 1) * pageSize;
  const visibleRows = sortedSubjects.slice(startIndex, startIndex + pageSize);
  const totalCount = sortedSubjects.length;

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
    (option: (typeof SUBJECT_STATUS_FILTERS)[number]) => {
      setStatusFilter(option);
      setPage(1);
      setShowFilter(false);
    },
    []
  );

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 min-h-screen flex flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <main className="relative z-0 p-4 md:p-6 lg:p-8 md:ml-64">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-gray-500">
              <span className="text-gray-400">Master Data</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">
                Manage Subjects
              </span>
            </nav>

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-[#f3e8ff] text-[#6c2bd9]">
                  <BookOpen className="h-7 w-7" />
                </span>
                <h1 className="text-lg font-semibold text-gray-900">
                  Manage Subjects
                </h1>
              </div>
            </section>

            {/* Kartu Subjects List */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="px-6 pt-5 pb-6 space-y-6">
                {/* Baris judul + Add Subject di kanan */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Subjects List
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      router.push("/master-data/subjects/add-subject")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6c2bd9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5922b8]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Subject
                  </button>
                </div>

                {/* Baris Filter + Search (kiri) dan Download (kanan) */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                    {/* Filter */}
                    <div className="relative w-full max-w-[140px]">
                      {/* ...blok filter kamu tetap... */}
                    </div>

                    {/* Search seperti di gambar: tinggi konsisten & lebar tetap */}
                    <div className="flex-1">
                      <label htmlFor="subject-search" className="sr-only">
                        Search subjects
                      </label>
                      <div
                        className="group relative flex h-11 items-center w-full max-w-[420px]
                          rounded-lg border border-gray-300 bg-white pl-3 pr-2 shadow-sm transition
                          focus-within:border-[#6c2bd9] focus-within:ring-2 focus-within:ring-[#6c2bd9]/30"
                      >
                        <Search
                          className="h-4 w-4 text-gray-400"
                          aria-hidden="true"
                        />
                        <input
                          id="subject-search"
                          type="search"
                          value={query}
                          onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                          }}
                          placeholder="Search Here"
                          className="w-full bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                        />
                        {query && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuery("");
                              setPage(1);
                            }}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            aria-label="Clear search"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Download di kanan */}
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 whitespace-nowrap"
                  >
                    <Download className="h-4 w-4 shrink-0" />
                    Download Data
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#f8f5ff]">
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column.key}
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-[#5b21b6]"
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
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {visibleRows.map((row) => (
                        <tr key={row.code} className="hover:bg-slate-50">
                          <td className="px-3 py-3 text-sm text-gray-800">
                            {row.code}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-800">
                            {row.name}
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600">
                            {row.description}
                          </td>
                          <td className="px-3 py-3 text-sm">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="rounded-md p-2 text-[#6c2bd9] transition hover:bg-purple-50"
                                aria-label={`Edit ${row.name}`}
                              >
                                <PenSquare className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/master-data/subjects/subject-detail?code=${encodeURIComponent(
                                      row.code
                                    )}`
                                  )
                                }
                                className="rounded-md p-2 text-[#6c2bd9] transition hover:bg-purple-50"
                                aria-label={`View ${row.name}`}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {visibleRows.length === 0 && (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="py-12 text-center text-sm text-gray-500"
                          >
                            No subjects match the current filters.
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
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
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

export default SubjectManagementPage;
