"use client";
import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Pagination from "../../components/Pagination";
import OverviewCard from "../../components/OverviewCard";
import SectionCard from "../../components/SectionCard";
import StatusBadge from "../../components/StatusBadge";
import { Inter } from "next/font/google";
import { Calendar, Download, Eye, Search, ChevronUp, ChevronDown } from "lucide-react";

// Inter font for this page
const inter = Inter({ subsets: ["latin"] });

// Helpers: currency and date formatting
const toIDR = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const ordinal = (d: number) => {
  const j = d % 10, k = d % 100;
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

// Types for payments table rows
type PaymentRow = {
  id: string;
  name: string;
  class: string;
  amount: number;
  status: "Paid" | "Unpaid";
  due: string; // ISO
  paidAt?: string | null; // ISO or null
};

// Seed data (>= 25 rows). Includes the 4 required rows.
const baseRows: PaymentRow[] = [
  { id: "23834732", name: "Budiyono Siregar", class: "VII-A", amount: 350000, status: "Unpaid", due: "2025-08-05", paidAt: null },
  { id: "83746152", name: "Bambang Pamungkas", class: "IX-A", amount: 350000, status: "Paid", due: "2025-08-03", paidAt: "2025-08-04" },
  { id: "10298910", name: "Harry Styles", class: "VIII-B", amount: 350000, status: "Unpaid", due: "2025-08-06", paidAt: null },
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

// CSV export helper
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

const DashboardPage: React.FC = () => {
  // Sidebar toggle for small screens
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Overview dummy values
  const overview = [
    { title: "Students", subtitle: "Total registered", value: 1250, accent: "primary" as const },
    { title: "Teachers", subtitle: "Active", value: 84 },
    { title: "Classes", subtitle: "Ongoing", value: 36 },
    { title: "Parents", subtitle: "Connected", value: 980 },
  ];

  // Payments table state
  const [rows] = useState<PaymentRow[]>(() => makeRows());
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState(""); // debounced
  const [classFilter, setClassFilter] = useState("All Class");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(2); // default page = 2
  const [pageSize, setPageSize] = useState(4);
  const [sortKey, setSortKey] = useState<keyof PaymentRow>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Debounce search input for better UX
  useEffect(() => {
    const t = setTimeout(() => setQuery(queryInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [queryInput]);

  // Filter → Sort → Paginate
  const filtered = useMemo(() => {
    let out = [...rows];
    if (classFilter !== "All Class") out = out.filter((r) => r.class === classFilter);
    if (statusFilter !== "All Status") out = out.filter((r) => r.status === (statusFilter as any));
    if (query) {
      out = out.filter((r) => `${r.name} ${r.class}`.toLowerCase().includes(query));
    }
    out.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      let cmp = 0;
      if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [rows, classFilter, statusFilter, query, sortKey, sortDir]);

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

  return (
    <div className={inter.className}>
      {/* Fixed sidebar + spacer, no ml-64 on content */}
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="w-64 shrink-0" aria-hidden />

        {/* Content column */}
        <div className="flex-1 bg-slate-100 relative z-0">
          <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((s) => !s)} />

          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Welcome header */}
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
              <span role="img" aria-label="waving hand">👋</span> Welcome, Dafa Aulia, have a great day !
            </h1>

            {/* Overview grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {overview.map((o, idx) => (
                <OverviewCard key={idx} title={o.title} subtitle={o.subtitle} value={o.value} accent={idx === 0 ? "primary" : "default"} />
              ))}
            </div>

            {/* Student Tuition Payments section */}
            <SectionCard
              title="Student Tuition Payments"
              headerRight={
                <div className="flex items-center gap-2">
                  {/* Period button (dummy) */}
                  <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]">
                    <Calendar className="w-4 h-4" />
                    <span>Current Period (August, 2025)</span>
                  </button>
                </div>
              }
            >
              {/* Filters row */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* All Class */}
                  <div>
                    <label htmlFor="f-class" className="block text-xs text-gray-600 mb-1">Class</label>
                    <select
                      id="f-class"
                      aria-label="Filter by class"
                      value={classFilter}
                      onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
                      className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      {['All Class','VII-A','XI-A Regular','XI-A Plus','IX-A','VIII-B'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* All Status */}
                  <div>
                    <label htmlFor="f-status" className="block text-xs text-gray-600 mb-1">Status</label>
                    <select
                      id="f-status"
                      aria-label="Filter by payment status"
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                      className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                    >
                      {['All Status','Paid','Unpaid'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {/* Download button right-aligned on small, sits at row end on grid */}
                  <div className="sm:col-span-1 flex sm:justify-end">
                    <button
                      aria-label="Download filtered data"
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
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    aria-label="Search payments"
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
                        { key: "name", label: "Student Name" },
                        { key: "class", label: "Class" },
                        { key: "amount", label: "Amount (IDR)" },
                        { key: "status", label: "Status" },
                        { key: "due", label: "Due Date" },
                        { key: "paidAt", label: "Payment Date" },
                        { key: "action" as const, label: "Action" },
                      ]).map((col) => (
                        <th key={col.key as string} className="text-left font-semibold py-2 px-3 select-none">
                          <button
                            disabled={col.key === "action"}
                            onClick={() => col.key !== "action" && toggleSort(col.key as keyof PaymentRow)}
                            aria-sort={sortKey === (col.key as keyof PaymentRow) ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                            className={`inline-flex items-center gap-1 ${col.key !== "action" ? "hover:underline" : "cursor-default"}`}
                            aria-label={`Sort by ${col.label}`}
                          >
                            <span>{col.label}</span>
                            {col.key !== "action" && (
                              sortKey === (col.key as keyof PaymentRow) ? (
                                sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )
                            )}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-gray-800">{r.name}</td>
                        <td className="px-3 py-2 text-gray-800">{r.class}</td>
                        <td className="px-3 py-2 text-gray-800">{toIDR(r.amount)}</td>
                        <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                        <td className="px-3 py-2 text-gray-800">{fmtDate(r.due)}</td>
                        <td className="px-3 py-2 text-gray-800">{r.paidAt ? fmtDate(r.paidAt) : "-/-"}</td>
                        <td className="px-3 py-2">
                          <button
                            aria-label={`View ${r.name}`}
                            onClick={() => console.log("View tuple", r)}
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

              {/* Footer: size selector + pagination */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <span>Showing</span>
                  <select
                    aria-label="Rows per page"
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
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
};

export default DashboardPage;

