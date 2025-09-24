"use client";

import { useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import StatusBadge from "../../../components/StatusBadge";
import {
  BookOpen,
  ClipboardList,
  Download,
  Eye,
  Filter,
  PenSquare,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const statusFilterOptions = ["All", "Active", "Non Active"] as const;
type StatusFilter = (typeof statusFilterOptions)[number];

type AssessmentCategoryRow = {
  id: string;
  name: string;
  type: string;
  relatedTo: string;
  status: "Active" | "Non Active";
};

type ReportFormatCard = {
  id: string;
  title: string;
  createdAt: string;
  status: "Active" | "Non Active";
};

const assessmentCategories: AssessmentCategoryRow[] = [
  {
    id: "uts",
    name: "UTS",
    type: "Quantitative (Number)",
    relatedTo: "Subject",
    status: "Active",
  },
  {
    id: "uas",
    name: "UAS",
    type: "Quantitative (Number)",
    relatedTo: "Subject",
    status: "Active",
  },
  {
    id: "tasks",
    name: "Average Daily Tasks",
    type: "Quantitative (Number)",
    relatedTo: "Subject",
    status: "Active",
  },
  {
    id: "honesty",
    name: "Honesty",
    type: "Qualitative (Text)",
    relatedTo: "Personal Assessment",
    status: "Active",
  },
  {
    id: "discipline",
    name: "Discipline",
    type: "Qualitative (Text)",
    relatedTo: "Personal Assessment",
    status: "Non Active",
  },
];

const reportFormats: ReportFormatCard[] = [
  {
    id: "even-2024",
    title: "Even Semester Report 2024/2025",
    createdAt: "15 Jun 2025 - 15:32",
    status: "Active",
  },
  {
    id: "odd-2024",
    title: "Odd Semester Report 2024/2025",
    createdAt: "14 Jun 2025 - 15:32",
    status: "Active",
  },
  {
    id: "portfolio-2024",
    title: "Portfolio Assessment 2024",
    createdAt: "10 May 2025 - 11:00",
    status: "Non Active",
  },
];

const StudentReportPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"assessment" | "report">(
    "assessment"
  );
  const [categoryQuery, setCategoryQuery] = useState("");
  const [reportQuery, setReportQuery] = useState("");
  const [categoryStatus, setCategoryStatus] = useState<StatusFilter>("All");
  const [reportStatus, setReportStatus] = useState<StatusFilter>("All");
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [reportFilterOpen, setReportFilterOpen] = useState(false);

  useEffect(() => {
    setCategoryFilterOpen(false);
    setReportFilterOpen(false);
  }, [activeTab]);

  const filteredCategories = useMemo(() => {
    const normalized = categoryQuery.trim().toLowerCase();

    return assessmentCategories.filter((row) => {
      const matchStatus =
        categoryStatus === "All" || row.status === categoryStatus;
      if (!matchStatus) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const text = `${row.name} ${row.type} ${row.relatedTo}`.toLowerCase();
      return text.includes(normalized);
    });
  }, [categoryQuery, categoryStatus]);

  const filteredReports = useMemo(() => {
    const normalized = reportQuery.trim().toLowerCase();

    return reportFormats.filter((format) => {
      const matchStatus =
        reportStatus === "All" || format.status === reportStatus;
      if (!matchStatus) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return format.title.toLowerCase().includes(normalized);
    });
  }, [reportQuery, reportStatus]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  useEffect(() => {
    setPage(1);
  }, [categoryQuery, categoryStatus]);

  const totalCount = filteredCategories.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  // jaga-jaga kalau page > pageCount setelah ganti filter/pageSize
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [pageCount, page]);

  const pagedCategories = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredCategories.slice(start, end);
  }, [filteredCategories, page, pageSize]);

  // window tombol halaman (maks 5 tombol)
  const pageWindow = useMemo(() => {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    const start = Math.max(
      1,
      Math.min(page - half, pageCount - windowSize + 1)
    );
    const end = Math.min(pageCount, start + windowSize - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, pageCount]);

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          active="Master Data"
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <main className="relative z-0 p-4 md:p-6 lg:p-8 md:ml-64">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-gray-500">
              <span className="text-gray-400">Master Data</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">
                Students Report Format
              </span>
            </nav>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-6">
                <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#6c2bd9]">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold text-gray-900">
                      Students Report Format
                    </h1>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 px-6">
                <div className="flex gap-6 text-sm font-semibold text-gray-600">
                  <button
                    type="button"
                    className={`relative py-4 transition focus:outline-none ${
                      activeTab === "assessment"
                        ? "text-[#6c2bd9]"
                        : "hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("assessment")}
                  >
                    Assessment Category
                    {activeTab === "assessment" && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#6c2bd9]" />
                    )}
                  </button>
                  <button
                    type="button"
                    className={`relative py-4 transition focus:outline-none ${
                      activeTab === "report"
                        ? "text-[#6c2bd9]"
                        : "hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("report")}
                  >
                    Report Format
                    {activeTab === "report" && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#6c2bd9]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-[#f7f8fb] px-6 pb-6 pt-5">
                {activeTab === "assessment" ? (
                  <div className="space-y-6">
                    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Assessment Category List
                        </h2>
                      </div>
                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#581c87]"
                        >
                          <Plus className="h-4 w-4" />
                          Add New Category
                        </button>
                      </div>
                    </header>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* Bagian kiri: filter + search */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setCategoryFilterOpen((open) => !open)
                            }
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                          >
                            <Filter className="h-4 w-4" />
                            Filter
                          </button>
                          {categoryFilterOpen && (
                            <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-lg">
                              <p className="mb-2 font-semibold text-gray-700">
                                Status
                              </p>
                              <div className="space-y-1">
                                {statusFilterOptions.map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                      setCategoryStatus(option);
                                      setCategoryFilterOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition ${
                                      categoryStatus === option
                                        ? "bg-[#f3e8ff] text-[#6c2bd9]"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {categoryStatus === option && (
                                      <span className="text-xs font-semibold">
                                        Selected
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <label className="relative block w-full sm:w-64">
                          <span className="absolute left-3 top-2.5 text-gray-400">
                            <Search className="h-4 w-4" />
                          </span>
                          <input
                            value={categoryQuery}
                            onChange={(event) =>
                              setCategoryQuery(event.target.value)
                            }
                            type="search"
                            placeholder="Search here"
                            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                          />
                        </label>
                      </div>

                      {/* Bagian kanan: download */}
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-[#6c2bd9] transition hover:bg-white"
                      >
                        <Download className="h-4 w-4" />
                        Download Data
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Category Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Assessment Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Related To
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {pagedCategories.map((row) => (
                              <tr key={row.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                  {row.name}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600">
                                  {row.type}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600">
                                  {row.relatedTo}
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <StatusBadge status={row.status} />
                                </td>
                                <td className="px-4 py-4">
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
                                      className="rounded-md p-2 text-[#6c2bd9] transition hover:bg-purple-50"
                                      aria-label={`View ${row.name}`}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}

                            {filteredCategories.length === 0 && (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                  No categories found for the selected filters.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        <div className="border-t border-gray-100 bg-white px-4 py-3">
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

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                                className="rounded-md border border-gray-200 px-2 py-1 text-sm disabled:opacity-50"
                                aria-label="First page"
                              >
                                «
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                                className="rounded-md border border-gray-200 px-2 py-1 text-sm disabled:opacity-50"
                                aria-label="Previous page"
                              >
                                ‹
                              </button>

                              {pageWindow.map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setPage(p)}
                                  className={`rounded-md border px-3 py-1.5 text-sm transition ${
                                    p === page
                                      ? "bg-[#6c2bd9] text-white"
                                      : "bg-white hover:bg-gray-50 text-gray-700"
                                  }`}
                                  aria-current={p === page ? "page" : undefined}
                                >
                                  {p}
                                </button>
                              ))}

                              <button
                                type="button"
                                onClick={() =>
                                  setPage((p) => Math.min(pageCount, p + 1))
                                }
                                disabled={page === pageCount}
                                className="rounded-md border border-gray-200 px-2 py-1 text-sm disabled:opacity-50"
                                aria-label="Next page"
                              >
                                ›
                              </button>
                              <button
                                type="button"
                                onClick={() => setPage(pageCount)} // Go >> ke halaman terakhir
                                disabled={page === pageCount}
                                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-[#6c2bd9] transition hover:bg-purple-50 disabled:opacity-50"
                                aria-label="Last page"
                              >
                                Go {">>"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Report Format List
                        </h2>
                      </div>
                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                          onClick={() => setReportFilterOpen((open) => !open)}
                        >
                          <Filter className="h-4 w-4" />
                          Sort
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#581c87]"
                        >
                          <Plus className="h-4 w-4" />
                          Add Report Format
                        </button>
                      </div>
                    </header>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="relative block w-full sm:w-72">
                        <span className="absolute left-3 top-2.5 text-gray-400">
                          <Search className="h-4 w-4" />
                        </span>
                        <input
                          value={reportQuery}
                          onChange={(event) =>
                            setReportQuery(event.target.value)
                          }
                          type="search"
                          placeholder="Search here"
                          className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                        />
                      </label>
                      {reportFilterOpen && (
                        <div className="relative sm:static">
                          <div className="sm:absolute sm:right-0 sm:top-0 sm:mt-0">
                            <div className="mt-2 w-48 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-lg sm:mt-0">
                              <p className="mb-2 font-semibold text-gray-700">
                                Status
                              </p>
                              <div className="space-y-1">
                                {statusFilterOptions.map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                      setReportStatus(option);
                                      setReportFilterOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition ${
                                      reportStatus === option
                                        ? "bg-[#f3e8ff] text-[#6c2bd9]"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {reportStatus === option && (
                                      <span className="text-xs font-semibold">
                                        Selected
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {filteredReports.map((format) => (
                        <div
                          key={format.id}
                          className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex flex-1 items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#6c2bd9]">
                              <ClipboardList className="h-6 w-6" />
                            </div>
                            <div>
                              <button
                                type="button"
                                className="text-left text-base font-semibold text-[#5b21b6] transition hover:underline"
                              >
                                {format.title}
                              </button>
                              <p className="mt-1 text-sm text-gray-500">
                                Created at : {format.createdAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
                            <StatusBadge status={format.status} />
                          </div>
                        </div>
                      ))}
                      {filteredReports.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm text-gray-500">
                          No report formats found for the selected filters.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentReportPage;
