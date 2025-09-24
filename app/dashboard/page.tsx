"use client";
import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Pagination from "../../components/Pagination";
import OverviewCard from "../../components/OverviewCard";
import SectionCard from "../../components/SectionCard";
import StatusBadge from "../../components/StatusBadge";
import { Inter } from "next/font/google";
import {
  Calendar,
  Download,
  Eye,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const toIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const ordinal = (d: number) => {
  const j = d % 10,
    k = d % 100;
  if (j === 1 && k !== 11) return `${d}st`;
  if (j === 2 && k !== 12) return `${d}nd`;
  if (j === 3 && k !== 13) return `${d}rd`;
  return `${d}th`;
};
const fmtDate = (iso: string) => {
  const dt = new Date(iso);
  const month = dt.toLocaleString("en-US", { month: "long" });
  return `${month} ${ordinal(dt.getDate())}, ${dt.getFullYear()}`;
};

type PaymentRow = {
  id: string;
  name: string;
  class: string;
  amount: number;
  status: "Paid" | "Unpaid";
  due: string;
  paidAt?: string | null;
};

const baseRows: PaymentRow[] = [
  { id: "23834732", name: "Budiyono Siregar", class: "VII-A", amount: 350000, status: "Unpaid", due: "2025-08-05" },
  { id: "83746152", name: "Bambang Pamungkas", class: "IX-A", amount: 350000, status: "Paid", due: "2025-08-03", paidAt: "2025-08-04" },
  { id: "10298910", name: "Harry Styles", class: "VIII-B", amount: 350000, status: "Unpaid", due: "2025-08-06" },
  { id: "67281920", name: "Freddy Mercury", class: "IX-A", amount: 350000, status: "Paid", due: "2025-08-02", paidAt: "2025-08-03" },
];

function makeRows(): PaymentRow[] {
  const classes = ["VII-A", "XI-A Regular", "XI-A Plus", "IX-A", "VIII-B"];
  const names = [
    "Agus Salim", "Siti Nurhaliza", "Rudi Hartono", "Dewi Lestari", "Rangga Saputra",
    "Maya Fitri", "Andi Wijaya", "Budi Santoso", "Citra Ayu", "Doni Pratama",
    "Eka Putri", "Fajar Ramadhan", "Gita Savitri", "Halim Perdana", "Intan Permata",
    "Joko Susilo", "Kirana Wulan", "Lutfi Kurnia", "Mawar Melati", "Naufal Rizky",
  ];
  const rows: PaymentRow[] = [...baseRows];
  let i = 0;
  while (rows.length < 26) {
    const name = names[i % names.length];
    const cls = classes[i % classes.length];
    const amount = 300000 + ((i % 4) * 50000);
    const due = `2025-08-${String(2 + (i % 20)).padStart(2, "0")}`;
    const paid = i % 3 === 0;
    rows.push({
      id: (90000000 + i).toString(),
      name,
      class: cls,
      amount,
      status: paid ? "Paid" : "Unpaid",
      due,
      paidAt: paid ? `2025-08-${String(3 + (i % 20)).padStart(2, "0")}` : null,
    });
    i++;
  }
  return rows;
}

function exportCSV(rows: PaymentRow[]) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  const fname = `payments_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.csv`;
  const header = ["Student Name", "Class", "Amount", "Status", "Due Date", "Payment Date"];
  const body = rows.map((r) => [r.name, r.class, r.amount, r.status, r.due, r.paidAt ?? "-/-"]);
  const csv = [header, ...body]
    .map((line) => line.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rows] = useState<PaymentRow[]>(() => makeRows());

  const [period, setPeriod] = useState<{ month: number; year: number }>({ month: 7, year: 2025 });
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All Class");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [sortKey, setSortKey] = useState<keyof PaymentRow>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [queryInput]);

  const matchPeriod = (row: PaymentRow, p: { month: number; year: number }) => {
    const d = new Date(row.due);
    return d.getFullYear() === p.year && d.getMonth() === p.month;
  };

  const filtered = useMemo(() => {
    let out = rows.filter((r) => matchPeriod(r, period));
    if (classFilter !== "All Class") out = out.filter((r) => r.class === classFilter);
    if (statusFilter !== "All Status") out = out.filter((r) => r.status === (statusFilter as any));
    if (query) out = out.filter((r) => `${r.name} ${r.class}`.toLowerCase().includes(query));
    out.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [rows, period, classFilter, statusFilter, query, sortKey, sortDir]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: keyof PaymentRow) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const periodLabel = `${months[period.month]}, ${period.year}`;

  const overview = [
    { title: "Active Teachers", subtitle: "Total Active Teachers Count", value: 24, accent: "primary" as const },
    { title: "Active Students", subtitle: "Total Active Students Count", value: 84 },
    { title: "Parents", subtitle: "Total Parents Count", value: 310 },
    { title: "Active Admin", subtitle: "Total Active Students Count", value: 8 },
  ];

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="w-64 shrink-0" aria-hidden />

        <div className="flex-1 bg-slate-100 relative z-0">
          <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((s) => !s)} />

          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
              👋 Welcome, Dafa Aulia, have a great day !
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {overview.map((o, idx) => (
                <OverviewCard key={idx} title={o.title} subtitle={o.subtitle} value={o.value} accent={idx === 0 ? "primary" : "default"} />
              ))}
            </div>

            <SectionCard
              title="Student Tuition Payments"
              headerRight={
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Current Period ({periodLabel})</span>
                  </div>
                  <div className="relative">
                    <select
                      value={period.month}
                      onChange={(e) => setPeriod((p) => ({ ...p, month: Number(e.target.value) }))}
                      className="appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      {months.map((m, i) => (
                        <option key={m} value={i}>{m}</option>
                      ))}
                    </select>
                    <ChevronsUpDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={period.year}
                      onChange={(e) => setPeriod((p) => ({ ...p, year: Number(e.target.value) }))}
                      className="appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      {[2023, 2024, 2025, 2026].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <ChevronsUpDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              }
            >
              {/* Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <label className="block text-xs text-gray-600 mb-1">Class</label>
                    <select
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                      className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      {["All Class", "VII-A", "XI-A Regular", "XI-A Plus", "IX-A", "VIII-B"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronsUpDown className="absolute right-2 top-8 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs text-gray-600 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      {["All Status", "Paid", "Unpaid"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronsUpDown className="absolute right-2 top-8 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="sm:col-span-1 flex sm:justify-end">
                    <button
                      onClick={() => exportCSV(filtered)}
                      className="inline-flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Data</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="mb-4 relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Search Here"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                />
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#6c2bd9]">
                      {[
                        { key: "name", label: "Student Name" },
                        { key: "class", label: "Class" },
                        { key: "amount", label: "Amount (IDR)" },
                        { key: "status", label: "Status" },
                        { key: "due", label: "Due Date" },
                        { key: "paidAt", label: "Payment Date" },
                        { key: "action" as const, label: "Action" },
                      ].map((col) => (
                        <th key={col.key as string} className="font-semibold py-2 px-3">
                          {col.key === "action" ? (
                            <div className="flex justify-center">{col.label}</div>
                          ) : (
                            <button
                              onClick={() => toggleSort(col.key as keyof PaymentRow)}
                              className="flex items-center gap-1 hover:underline"
                            >
                              {col.label}
                              {sortKey === (col.key as keyof PaymentRow) ? (
                                sortDir === "asc" ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )
                              ) : (
                                <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                              )}
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2">{r.name}</td>
                        <td className="px-3 py-2">{r.class}</td>
                        <td className="px-3 py-2">{toIDR(r.amount)}</td>
                        <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                        <td className="px-3 py-2">{fmtDate(r.due)}</td>
                        <td className="px-3 py-2">{r.paidAt ? fmtDate(r.paidAt) : "-/-"}</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center">
                            <button className="p-2 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]">
                              <Eye className="w-4 h-4 text-[#6c2bd9]" />
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
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                  >
                    {[4, 10, 25].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span>from {total} data</span>
                </div>
                <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
              </div>
            </SectionCard>
          </main>
        </div>
      </div>
    </div>
  );
}
