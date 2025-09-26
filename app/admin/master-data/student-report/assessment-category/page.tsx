﻿﻿﻿"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/layout-global/StatusBadge";
import {
  Download,
  Eye,
  Filter,
  PenSquare,
  Plus,
  Search,
} from "lucide-react";
import AddButton from "@/components/layout-global/AddButton";
import EditAction from "@/components/layout-global/EditAction";
import ViewAction from "@/components/layout-global/ViewAction";
import DownloadButton from "@/components/layout-global/DownloadButton";

type StatusFilter = "All" | "Active" | "Non Active";

type AssessmentCategoryRow = {
  id: string;
  name: string;
  type: string;
  relatedTo: string;
  status: "Active" | "Non Active";
};

const statusFilterOptions: StatusFilter[] = ["All", "Active", "Non Active"];

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
    id: "attitude",
    name: "Attitude",
    type: "Qualitative (Text)",
    relatedTo: "Personal Assessment",
    status: "Active",
  },
];

const AssessmentCategoryPage = () => {
  const router = useRouter();
  const [categoryQuery, setCategoryQuery] = useState("");
  const [categoryStatus, setCategoryStatus] = useState<StatusFilter>("All");
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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

      return (
        row.name.toLowerCase().includes(normalized) ||
        row.type.toLowerCase().includes(normalized) ||
        row.relatedTo.toLowerCase().includes(normalized)
      );
    });
  }, [categoryQuery, categoryStatus]);

  useEffect(() => {
    setPage(1);
  }, [categoryQuery, categoryStatus, pageSize]);

  const totalCount = filteredCategories.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const pagedCategories = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredCategories.slice(start, end);
  }, [filteredCategories, page, pageSize]);

  const pageWindow = useMemo(() => {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    const start = Math.max(
      1,
      Math.min(page - half, pageCount - windowSize + 1)
    );
    const end = Math.min(pageCount, start + windowSize - 1);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, pageCount]);

  const REPORT_BASE = "/admin/master-data/student-report/assessment-category";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Assessment Category List
          </h2>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">

          <div className="flex justify-end">
            <AddButton entity="New Category" href="/admin/master-data/student-report/assessment-category/add-category" />
            {/* Renders: “Add Role” with the purple pill styling */}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryFilterOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            {categoryFilterOpen && (
              <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-lg">
                <p className="mb-2 font-semibold text-gray-700">Status</p>
                <div className="space-y-1">
                  {statusFilterOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setCategoryStatus(option);
                        setCategoryFilterOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition ${categoryStatus === option
                        ? "bg-[#f3e8ff] text-[#6c2bd9]"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <span>{option}</span>
                      {categoryStatus === option && (
                        <span className="text-xs font-semibold">Selected</span>
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
              onChange={(event) => setCategoryQuery(event.target.value)}
              type="search"
              placeholder="Search here"
              className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
            />
          </label>
        </div>

        <DownloadButton label="Download Data" />
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
                  <td className="px-4 py-4 text-sm text-gray-600">{row.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {row.relatedTo}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <EditAction
                        href={`${REPORT_BASE}/${encodeURIComponent(row.id)}/edit`}
                        title={`Edit ${row.id}`}
                      />

                      {/* View -> detail-category page */}
                      <ViewAction
                        href={`${REPORT_BASE}/detail-category?id=${encodeURIComponent(row.id)}`}
                        title={`View ${row.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
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
                  {[5, 10, 25].map((option) => (
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
                  {"<<"}
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-gray-200 px-2 py-1 text-sm disabled:opacity-50"
                  aria-label="Previous page"
                >
                  {"<"}
                </button>

                {pageWindow.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition ${p === page
                      ? "bg-[#6c2bd9] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  disabled={page === pageCount}
                  className="rounded-md border border-gray-200 px-2 py-1 text-sm disabled:opacity-50"
                  aria-label="Next page"
                >
                  {">"}
                </button>
                <button
                  type="button"
                  onClick={() => setPage(pageCount)}
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
  );
};

export default AssessmentCategoryPage;
