﻿"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/layout-global/StatusBadge";
import {
  ChevronDown,
  ClipboardList,
  Filter,
  Plus,
  Search,
} from "lucide-react";

type StatusFilter = "All" | "Active" | "Non Active";

type ReportFormatCard = {
  id: string;
  title: string;
  createdAt: string;
  status: "Active" | "Non Active";
};

const statusFilterOptions: StatusFilter[] = ["All", "Active", "Non Active"];

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
];

const ReportFormatPage = () => {
  const router = useRouter();
  const [reportQuery, setReportQuery] = useState("");
  const [reportStatus, setReportStatus] = useState<StatusFilter>("All");
  const [reportFilterOpen, setReportFilterOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Report Format List</h2>
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
            onClick={() => router.push("/master-data/student-report/report-format/add-format")}
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
            onChange={(event) => setReportQuery(event.target.value)}
            type="search"
            placeholder="Search here"
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
          />
        </label>
        {reportFilterOpen && (
          <div className="relative sm:static">
            <div className="sm:absolute sm:right-0 sm:top-0 sm:mt-0">
              <div className="mt-2 w-48 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-lg sm:mt-0">
                <p className="mb-2 font-semibold text-gray-700">Status</p>
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
                        <span className="text-xs font-semibold">Selected</span>
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
  );
};

export default ReportFormatPage;
