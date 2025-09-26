"use client";
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/layout-global/Topbar";
import Pagination from "../../../components/layout-global/Pagination";
import PageHeader from "../../../components/layout-global/PageHeader";
import {
  Search,
  Download,
  Eye,
  Flag,
  ChevronDown,
  GraduationCap, // ikon untuk header
} from "lucide-react";

// Tipe data siswa
export type Student = {
  id: string; // Student ID
  name: string;
  email?: string | null;
  currentClass: string; // ex: "VII-A"
  status: "Active" | "Non Active";
  flag: "green" | "yellow" | "red";
};

// Data dummy (25 entri) agar pagination terasa
const baseStudents: Student[] = [
  { id: "23834732", name: "Budiyono Siregar", email: "budi@gmail.com", currentClass: "VII-A", status: "Active", flag: "yellow" },
  { id: "83746152", name: "Bambang Pamungkas", email: "bambang@gmail.com", currentClass: "IX-A", status: "Active", flag: "red" },
  { id: "10298910", name: "Harry Styles", email: null, currentClass: "VIII-B", status: "Non Active", flag: "green" },
  { id: "67281920", name: "Freddy Mercury", email: "freddy@gmail.com", currentClass: "IX-A", status: "Active", flag: "green" },
];

const classOpts = ["All Class", "VII-A", "VIII-B", "IX-A"] as const;
const flagOpts = ["All Flag", "green", "yellow", "red"] as const;
const statusOpts = ["All Status", "Active", "Non Active"] as const;

// Utility: membuat 25 data dengan pola
const buildInitialStudents = (): Student[] => {
  const arr: Student[] = [];
  const classes = ["VII-A", "VIII-B", "IX-A"];
  const flags: Student["flag"][] = ["green", "yellow", "red"];
  for (let i = 0; i < 25; i++) {
    const b = baseStudents[i % baseStudents.length];
    arr.push({
      id: (parseInt(b.id) + i * 13).toString().padStart(8, "0"),
      name: `${b.name} ${i + 1}`,
      email: i % 5 === 2 ? null : b.email,
      currentClass: classes[i % classes.length],
      status: i % 7 === 3 ? "Non Active" : "Active",
      flag: flags[i % flags.length],
    });
  }
  return arr;
};

// Utility: export ke CSV dan trigger download di client
const downloadCSV = (rows: Student[]) => {
  const header = ["Student ID", "Student Name", "Student Email", "Current Class", "Status", "Flag"];
  const body = rows.map((s) => [s.id, s.name, s.email ?? "- -", s.currentClass, s.status, s.flag]);
  const csv = [header, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "students.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// Badge status helper
const StatusBadge = ({ status }: { status: Student["status"] }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${status === "Active" ? "bg-[#e6f7ed] text-green-700" : "bg-[#ffe9e7] text-red-600"
      }`}
  >
    {status}
  </span>
);

// Warna ikon flag
const flagColor = (flag: Student["flag"]) => ({
  green: "#16a34a",
  yellow: "#eab308",
  red: "#ef4444",
}[flag]);

// Page component (client, with state)
const StudentsPage: React.FC = () => {
  // Sidebar behavior for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State & filters
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState(""); // debounced
  const [selectedClass, setSelectedClass] = useState<(typeof classOpts)[number]>("All Class");
  const [selectedFlag, setSelectedFlag] = useState<(typeof flagOpts)[number]>("All Flag");
  const [selectedStatus, setSelectedStatus] = useState<(typeof statusOpts)[number]>("All Status");

  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(4);
  const [sortKey, setSortKey] = useState<keyof Student>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Data source
  const students = useMemo(buildInitialStudents, []);

  // Debounce query input
  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [queryInput]);

  // Filtering
  const filtered = useMemo(() => {
    let rows = [...students];
    if (selectedClass !== "All Class") rows = rows.filter((s) => s.currentClass === selectedClass);
    if (selectedFlag !== "All Flag") rows = rows.filter((s) => s.flag === selectedFlag);
    if (selectedStatus !== "All Status") rows = rows.filter((s) => s.status === selectedStatus);
    if (query) {
      rows = rows.filter((s) =>
        [s.id, s.name, s.email ?? "", s.currentClass, s.status].join(" ").toLowerCase().includes(query)
      );
    }
    // Sorting
    rows.sort((a: Student, b: Student) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      let cmp = 0;
      if (typeof va === "string" && typeof vb === "string") cmp = va.localeCompare(vb, undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [students, selectedClass, selectedFlag, selectedStatus, query, sortKey, sortDir]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Sort header click handler
  const toggleSort = (key: keyof Student) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Action: view details
  const onView = (id: string) => {
    console.log("View student:", id);
    alert(`View detail for ${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="flex">
        {/* Sidebar fixed on left (z-30) */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Right content area shifted by sidebar width */}
        <div className="flex-1 min-h-screen flex flex-col">
          <Topbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

          <main className="relative z-0 ml-64 px-6 lg:px-10 py-6 space-y-6">
            {/* === Reusable PageHeader === */}
            <PageHeader
              title="Students Data"
              icon={<GraduationCap className="w-5 h-5 text-[#6c2bd9]" aria-hidden />}
            />

            {/* Filters + Download */}
            <section className="bg-white rounded-xl shadow-sm border border-[#ececec] p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Dropdowns */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Class filter */}
                  <div>
                    <label htmlFor="classFilter" className="block text-xs text-gray-600 mb-1">Class</label>
                    <div className="relative">
                      <select
                        id="classFilter"
                        aria-label="Filter by class"
                        value={selectedClass}
                        onChange={(e) => { setSelectedClass(e.target.value as any); setPage(1); }}
                        className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                      >
                        {classOpts.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Flag filter */}
                  <div>
                    <label htmlFor="flagFilter" className="block text-xs text-gray-600 mb-1">Flag</label>
                    <div className="relative">
                      <select
                        id="flagFilter"
                        aria-label="Filter by flag"
                        value={selectedFlag}
                        onChange={(e) => { setSelectedFlag(e.target.value as any); setPage(1); }}
                        className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                      >
                        {flagOpts.map((f) => (
                          <option key={f} value={f}>{f === "green" || f === "yellow" || f === "red" ? f[0].toUpperCase() + f.slice(1) : f}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Status filter */}
                  <div>
                    <label htmlFor="statusFilter" className="block text-xs text-gray-600 mb-1">Status</label>
                    <div className="relative">
                      <select
                        id="statusFilter"
                        aria-label="Filter by status"
                        value={selectedStatus}
                        onChange={(e) => { setSelectedStatus(e.target.value as any); setPage(1); }}
                        className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                      >
                        {statusOpts.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Download button */}
                <div className="flex lg:justify-end">
                  <button
                    aria-label="Download filtered data"
                    onClick={() => downloadCSV(filtered)}
                    className="inline-flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Data</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Table card */}
            <section className="bg-white rounded-xl shadow-sm border border-[#ececec] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Students List</h2>
              </div>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    aria-label="Search students"
                    value={queryInput}
                    onChange={(e) => { setQueryInput(e.target.value); setPage(1); }}
                    placeholder="Search Here"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#6c2bd9]">
                      {([
                        { key: "id", label: "Student ID" },
                        { key: "name", label: "Student Name" },
                        { key: "email", label: "Student Email" },
                        { key: "currentClass", label: "Current Class" },
                        { key: "status", label: "Status" },
                        { key: "flag", label: "Current Flag" },
                        { key: "action", label: "Action" },
                      ] as const).map((col) => (
                        <th key={col.key as string} className="text-left font-semibold py-2 px-3 select-none">
                          <button
                            disabled={col.key === "action"}
                            onClick={() => col.key !== "action" && toggleSort(col.key as keyof Student)}
                            className={`inline-flex items-center gap-1 ${col.key !== "action" ? "hover:underline" : "cursor-default"}`}
                            aria-label={`Sort by ${col.label}`}
                          >
                            <span>{col.label}</span>
                            {col.key !== "action" && (
                              <span className="text-xs text-gray-400">
                                {sortKey === (col.key as keyof Student) ? (sortDir === "asc" ? "▲" : "▼") : "—"}
                              </span>
                            )}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paged.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>No students found</div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {paged.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-gray-800">{s.id}</td>
                        <td className="px-3 py-2 text-gray-800">{s.name}</td>
                        <td className="px-3 py-2 text-gray-600">{s.email ?? "- -"}</td>
                        <td className="px-3 py-2 text-gray-800">{s.currentClass}</td>
                        <td className="px-3 py-2"><StatusBadge status={s.status} /></td>
                        <td className="px-3 py-2">
                          <Flag className="w-4 h-4" style={{ color: flagColor(s.flag) }} aria-label={`${s.flag} flag`} />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            aria-label={`View ${s.id}`}
                            onClick={() => onView(s.id)}
                            className="p-2 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                          >
                            <Eye className="w-4 h-4 text-[#6c2bd9]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer: page size + pagination */}

              <div className="flex items-center gap-3">
                <Pagination
                  total={total}
                  page={currentPage}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={(sz) => { setPageSize(sz); setPage(1); }}
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
