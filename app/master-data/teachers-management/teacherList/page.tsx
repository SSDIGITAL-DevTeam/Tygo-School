"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import Header from "../../../../components/Header";
import Pagination from "../../../../components/Pagination";
import StatusBadge from "../../../../components/StatusBadge";
import { Inter } from "next/font/google";
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

type TeacherRow = {
  id: string;
  fullName: string;
  email: string;
  subjects: string[];
  homeroomClass: string | null;
  status: "Active" | "Non Active";
};

const inter = Inter({ subsets: ["latin"] });

const featuredRows: TeacherRow[] = [
  {
    id: "123456",
    fullName: "Dafa Aulia",
    email: "dafa@gmail.com",
    subjects: ["Math 01", "English 01"],
    homeroomClass: "VII-A",
    status: "Active",
  },
  {
    id: "789012",
    fullName: "Ryan Kusuma",
    email: "ryan@gmail.com",
    subjects: ["English 02"],
    homeroomClass: "IX-A",
    status: "Active",
  },
  {
    id: "345678",
    fullName: "Heriyanto",
    email: "heriyanto@gmail.com",
    subjects: ["Math 01", "Programming 02"],
    homeroomClass: null,
    status: "Non Active",
  },
  {
    id: "901234",
    fullName: "Imroatus",
    email: "imroatus@gmail.com",
    subjects: ["Programming 01"],
    homeroomClass: null,
    status: "Non Active",
  },
];

const leadingRows: TeacherRow[] = [
  {
    id: "102345",
    fullName: "Anisa Putri",
    email: "anisa.putri@school.id",
    subjects: ["Math 02"],
    homeroomClass: "VII-B",
    status: "Active",
  },
  {
    id: "104221",
    fullName: "Bambang Maulana",
    email: "bambang.maulana@school.id",
    subjects: ["Science 01"],
    homeroomClass: "VIII-A",
    status: "Active",
  },
  {
    id: "105987",
    fullName: "Citra Dewi",
    email: "citra.dewi@school.id",
    subjects: ["English 01"],
    homeroomClass: "IX-B",
    status: "Active",
  },
  {
    id: "108002",
    fullName: "Doni Saputra",
    email: "doni.saputra@school.id",
    subjects: ["Programming 01"],
    homeroomClass: null,
    status: "Non Active",
  },
];

const extraNames = [
  "Eka Pratama",
  "Fajar Ramdhan",
  "Gita Lestari",
  "Herman Wijaya",
  "Indah Kartika",
  "Joko Santoso",
  "Kirana Safira",
  "Lutfi Rahman",
  "Maya Anggraini",
  "Nurul Mawar",
  "Oskar Firmansyah",
  "Putri Prawita",
  "Qori Safitri",
  "Raka Prakoso",
  "Sari Winata",
  "Taufik Hidayat",
  "Usman Halim",
  "Vera Damayanti",
  "Wahyu Saputra",
  "Yani Marlina",
  "Zaki Kurniawan",
];

const subjectCombos: string[][] = [
  ["Math 01"],
  ["English 01"],
  ["Math 01", "Physics 01"],
  ["Biology 01"],
  ["Chemistry 01"],
  ["Programming 01"],
  ["Programming 02"],
  ["Design 01"],
  ["Art 01"],
  ["Math 02", "English 02"],
];

const homeroomPool: Array<string | null> = [
  "VII-A",
  "VII-B",
  "VIII-A",
  "VIII-B",
  "IX-A",
  "IX-B",
  null,
  null,
];

const slugifyName = (name: string, fallback: string) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.+|\.+$)/g, "");
  return slug || fallback;
};

const buildTeachers = (): TeacherRow[] => {
  const rows: TeacherRow[] = [...leadingRows, ...featuredRows];
  let i = 0;
  while (rows.length < 25) {
    const name = extraNames[i % extraNames.length];
    const subjects = subjectCombos[i % subjectCombos.length];
    const homeroom = homeroomPool[i % homeroomPool.length] ?? null;
    const id = (640000 + i * 7).toString().padStart(6, "0");
    rows.push({
      id,
      fullName: name,
      email: `${slugifyName(name, `teacher${i}`)}@schoolmail.id`,
      subjects,
      homeroomClass: homeroom,
      status: i % 6 === 0 ? "Non Active" : "Active",
    });
    i += 1;
  }
  return rows;
};

const columns: Array<{ key: keyof TeacherRow | "action"; label: string }> = [
  { key: "id", label: "Teacher ID" },
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "subjects", label: "Subject Specialization" },
  { key: "homeroomClass", label: "Homeroom Class" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

const TeacherManagementPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Non Active"
  >("All");
  const [showFilter, setShowFilter] = useState(false);
  const [pageSize, setPageSize] = useState(4);
  const [page, setPage] = useState(2);
  const [sort, setSort] = useState<{
    key: keyof TeacherRow;
    direction: "asc" | "desc";
  }>({
    key: "id",
    direction: "asc",
  });

  const teachers = useMemo(() => buildTeachers(), []);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredTeachers = useMemo(() => {
    return teachers.filter((row) => {
      if (statusFilter !== "All" && row.status !== statusFilter) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const haystack = [
        row.id,
        row.fullName,
        row.email,
        row.subjects.join(", "),
        row.homeroomClass ?? "",
        row.status,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [teachers, normalizedQuery, statusFilter]);

  const sortedTeachers = useMemo(() => {
    const copy = [...filteredTeachers];
    const key = sort.key;
    const dir = sort.direction;
    const numeric = key === "id";
    copy.sort((a, b) => {
      let va: string | number = "";
      let vb: string | number = "";
      switch (key) {
        case "id":
          va = parseInt(a.id, 10);
          vb = parseInt(b.id, 10);
          break;
        case "subjects":
          va = a.subjects.join(", ");
          vb = b.subjects.join(", ");
          break;
        case "homeroomClass":
          va = a.homeroomClass ?? "";
          vb = b.homeroomClass ?? "";
          break;
        default:
          va = (a as any)[key] ?? "";
          vb = (b as any)[key] ?? "";
      }
      if (typeof va === "number" && typeof vb === "number") {
        return dir === "asc" ? va - vb : vb - va;
      }
      const comparison = String(va).localeCompare(String(vb), undefined, {
        numeric,
        sensitivity: "base",
      });
      return dir === "asc" ? comparison : -comparison;
    });
    return copy;
  }, [filteredTeachers, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedTeachers.length / pageSize));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const startIndex = (page - 1) * pageSize;
  const visibleRows = sortedTeachers.slice(startIndex, startIndex + pageSize);
  const showingCount = visibleRows.length;
  const totalCount = sortedTeachers.length;

  const handleSort = (key: keyof TeacherRow) => {
    setSort((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setPage(1);
  };

  const applyStatusFilter = (value: "All" | "Active" | "Non Active") => {
    setStatusFilter(value);
    setShowFilter(false);
    setPage(1);
  };

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          active="Master Data"
        />

        <div className="flex-1 min-h-screen flex flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((value) => !value)} />

          <main className="relative z-0 ml-64 p-4 md:p-6 lg:p-8">
            <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
              <ol className="flex items-center gap-2">
                <li>Master Data</li>
                <li aria-hidden className="text-gray-400">
                  /
                </li>
                <li className="text-gray-900 font-medium">Manage Teachers</li>
              </ol>
            </nav>

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c2bd9] to-[#8b5cf6] text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Manage Teachers
                  </h1>
                </div>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Teachers List
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#581c87]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Teacher
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  {/* LEFT GROUP: Filter + Search */}
                  <div className="flex items-center gap-3 w-full xl:w-auto">
                    {/* Filter */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowFilter((open) => !open)}
                        className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                          showFilter || statusFilter !== "All"
                            ? "border-[#6c2bd9] text-[#6c2bd9] bg-purple-50"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-expanded={showFilter}
                      >
                        <Filter className="w-4 h-4" />
                        Filter
                        {statusFilter !== "All" && (
                          <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#6c2bd9] px-1 text-xs font-semibold text-white">
                            1
                          </span>
                        )}
                      </button>

                      {showFilter && (
                        <div className="absolute z-10 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-gray-700">
                            <span>Status</span>
                            <button
                              type="button"
                              aria-label="Close filter"
                              className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                              onClick={() => setShowFilter(false)}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {["All", "Active", "Non Active"].map((option) => (
                              <li key={option}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    applyStatusFilter(
                                      option as typeof statusFilter
                                    )
                                  }
                                  className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                                    statusFilter === option
                                      ? "bg-purple-100 text-[#6c2bd9] font-semibold"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  {option === "All" ? "All Status" : option}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Search */}
                    <div className="relative w-full xl:max-w-sm">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="search"
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setPage(1);
                        }}
                        placeholder="Search Here"
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                      />
                    </div>
                  </div>

                  {/* RIGHT: Download Button */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-[#6c2bd9] transition-colors hover:border-[#6c2bd9]/60 hover:text-[#581c87]"
                  >
                    <Download className="w-4 h-4" />
                    Download Data
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[#6c2bd9]">
                        {columns.map((column) => (
                          <th
                            key={column.key}
                            className="px-3 py-2 text-left font-semibold select-none"
                          >
                            {column.key === "action" ? (
                              <span>{column.label}</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleSort(column.key as keyof TeacherRow)
                                }
                                className="inline-flex items-center gap-1 hover:underline"
                                aria-label={`Sort by ${column.label}`}
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
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-slate-50"
                        >
                          <td className="px-3 py-3 text-gray-800">{row.id}</td>
                          <td className="px-3 py-3 text-gray-800">
                            {row.fullName}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {row.email}
                          </td>
                          <td className="px-3 py-3 text-gray-800">
                            {row.subjects.join(", ")}
                          </td>
                          <td className="px-3 py-3 text-gray-800">
                            {row.homeroomClass ?? "--"}
                          </td>
                          <td className="px-3 py-3">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  console.log("Edit teacher", row.id)
                                }
                                className="rounded-md p-2 text-[#6c2bd9] transition-colors hover:bg-purple-50"
                                aria-label={`Edit ${row.fullName}`}
                              >
                                <PenSquare className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  console.log("View teacher", row.id)
                                }
                                className="rounded-md p-2 text-[#6c2bd9] transition-colors hover:bg-purple-50"
                                aria-label={`View ${row.fullName}`}
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
                            className="py-12 text-center text-gray-500"
                          >
                            No teachers match the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="text-sm text-gray-700 flex items-center gap-2">
                    <span>Showing</span>
                    <select
                      value={pageSize}
                      onChange={(event) => {
                        setPageSize(Number(event.target.value));
                        setPage(1);
                      }}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
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
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-[#6c2bd9] transition-colors hover:bg-purple-50"
                    >
                      Go &gt;&gt;
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

export default TeacherManagementPage;
