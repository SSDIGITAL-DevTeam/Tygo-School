"use client";
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../../../components/admin/Sidebar";
import Topbar from "../../../../../components/layout-global/Topbar";
import ConfirmDialog from "../../../../../components/layout-global/ConfirmDialog";
import Toast from "../../../../../components/layout-global/Toast";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

type AdminDetail = {
  id: string;
  name: string;
  email: string;
  roleName: string;
  status: "Active" | "Non Active";
  accessibleFeatures: string[];
};

// Dummy DB for demo
const ADMIN_DB: Record<string, AdminDetail> = {
  meijiko: {
    id: "meijiko",
    name: "Meijiko",
    email: "meijiko@gmail.com",
    roleName: "Admin",
    status: "Active",
    accessibleFeatures: [
      "Subjects Management",
      "Teachers Management",
      "Classes Management",
      "Students Report Management",
      "Payment Administration",
      "System Settings",
      "School Profile",
    ],
  },
  "a-1001": {
    id: "a-1001",
    name: "Meijiko",
    email: "meijiko@gmail.com",
    roleName: "Admin",
    status: "Active",
    accessibleFeatures: [
      "Subjects Management",
      "Teachers Management",
      "Classes Management",
      "Students Report Management",
      "Payment Administration",
      "System Settings",
    ],
  },
};

const AdminDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = useMemo(() => String((params as any)?.id || ""), [params]);

  const [detail, setDetail] = useState<AdminDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        // Always try API first so data stays consistent with Admin List (which uses ids like a-1001, a-2000+)
        let data: AdminDetail | null = null;
        try {
          const res = await fetch(`/api/admins/${encodeURIComponent(id)}`);
          if (res.ok) {
            const raw = await res.json();
            data = {
              id,
              name: raw.name ?? "",
              email: raw.email ?? "",
              roleName: raw.role ?? "",
              status: (raw.status ?? "Active") as AdminDetail["status"],
              accessibleFeatures: [
                "Subjects Management",
                "Teachers Management",
                "Classes Management",
                "Students Report Management",
                "Payment Administration",
                "System Settings",
                "School Profile",
              ].slice(0, Number(raw.features ?? 4)),
            };
          }
        } catch {}
        // Fallback to local dummy map if API not available
        if (!data) data = ADMIN_DB[id] ?? null;
        if (cancelled) return;
        if (!data) setError("Admin not found");
        else setDetail(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const statusBadge = (s: AdminDetail["status"]) => (
    <span
      className={
        s === "Active"
          ? "inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
          : "inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20"
      }
    >
      {s}
    </span>
  );

  const onDelete = async () => {
    setConfirmOpen(false);
    // For demo: just simulate
    await new Promise((r) => setTimeout(r, 400));
    setToast("Admin deleted");
    setTimeout(() => router.push("/role-access/admin-list"), 800);
  };

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={false} />
        <div className="w-64 shrink-0" aria-hidden />
        <div className="flex-1 min-h-screen bg-slate-100 relative z-0">
          <Topbar offset={false} />
          <main className="p-4 md:p-6 lg:p-8 space-y-4">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600">
              <Link href="/role-access/admin-list" className="hover:underline">Admin List</Link>
              <span className="text-gray-400"> / </span>
              <span className="text-gray-900">Admin Detail</span>
            </div>

            {/* Header card */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <button aria-label="Go back" onClick={() => router.back()} className="mt-0.5 p-2 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Admin Detail</h1>
                  {!loading && detail?.name && <p className="text-sm text-gray-500">{detail.name}</p>}
                </div>
              </div>
              <div>{!loading && detail ? statusBadge(detail.status) : null}</div>
            </div>

            {/* Info Table */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="grid grid-cols-3 gap-0 text-sm font-semibold text-violet-700 border-b border-slate-200">
                <div className="p-3">Admin Name</div>
                <div className="p-3">Email</div>
                <div className="p-3">Role Name</div>
              </div>
              <div className="grid grid-cols-3 gap-0 divide-y divide-slate-200 text-sm text-gray-800">
                <div className="p-3 overflow-x-auto">{loading ? "Loading..." : detail?.name ?? "-"}</div>
                <div className="p-3 overflow-x-auto">{loading ? "Loading..." : detail?.email ?? "-"}</div>
                <div className="p-3 overflow-x-auto">{loading ? "Loading..." : detail?.roleName ?? "-"}</div>
              </div>
            </div>

            {/* Accessible Features */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="p-3 text-sm font-semibold text-violet-700 border-b border-slate-200">Accessible Features</div>
              <div className="p-3 bg-slate-50">
                {loading ? (
                  <div className="h-5 bg-slate-200 rounded animate-pulse w-40" />
                ) : detail?.accessibleFeatures?.length ? (
                  <ul className="list-disc pl-5 text-sm text-gray-800">
                    {detail.accessibleFeatures.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">No features listed</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                aria-label="Delete admin"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600"
              >
                <Trash2 className="w-4 h-4" /> Delete Data
              </button>
              {detail && (
                <Link
                  aria-label="Edit admin"
                  href={`/role-access/admin-list/${encodeURIComponent(detail.id)}/edit`}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <Pencil className="w-4 h-4" /> Edit Data
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Confirm delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete this admin?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onDelete}
        onClose={() => setConfirmOpen(false)}
      />
      <Toast message={toast || ""} show={!!toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default AdminDetailPage;
