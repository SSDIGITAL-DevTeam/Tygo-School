"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/layout-global/Topbar";
import { Inter } from "next/font/google";
import { Shield, Trash2, Pencil, Loader2, ChevronLeft } from "lucide-react";
import { getRoleById, type RoleDetail } from "@/lib/roles";

const inter = Inter({ subsets: ["latin"] });

const StatusBadge: React.FC<{ status: RoleDetail["status"] }> = ({ status }) => {
  const palette =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : "bg-rose-50 text-rose-700 ring-rose-600/20";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${palette}`}>
      {status}
    </span>
  );
};

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, title, description, loading, onConfirm, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
      <div className="absolute inset-0" aria-hidden onClick={onClose} />
      <div className="relative z-[201] w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Trash2 className="h-4 w-4" aria-hidden />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const LOADING_DELAY = 350;

export default function RoleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const roleId = useMemo(() => params?.id ?? "", [params]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RoleDetail | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRole(getRoleById(roleId) ?? null);
      setLoading(false);
    }, LOADING_DELAY);
    return () => clearTimeout(timer);
  }, [roleId]);

  const handleDelete = async () => {
    if (!role) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/roles/${encodeURIComponent(role.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete role");
      alert("Role deleted successfully");
      router.push("app/admin/role-access/role-management");
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="h-20 animate-pulse rounded-xl bg-white" aria-hidden />
          <div className="h-32 animate-pulse rounded-xl bg-white" aria-hidden />
          <div className="h-48 animate-pulse rounded-xl bg-white" aria-hidden />
        </div>
      );
    }

    if (!role) {
      return (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-600">Role not found.</p>
          <Link
            href="/role-access/role-management"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Back to Role Management
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-100">
              <Shield className="h-5 w-5 text-violet-700" aria-hidden />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Role Detail</h1>
              <p className="text-sm text-slate-500">{role.name}</p>
            </div>
          </div>
          <StatusBadge status={role.status} />
        </div>

        <div className="mt-4 rounded-lg ring-1 ring-slate-200">
          <div className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">Admin Name</div>
          <div className="px-4 py-3 text-sm text-slate-800">{role.name}</div>
        </div>

        <div className="mt-4 rounded-lg ring-1 ring-slate-200">
          <div className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">Accessible Features</div>
          <div className="px-4 py-3 text-sm text-slate-800">
            {role.features.length ? (
              <ul className="list-disc space-y-1 pl-4">
                {role.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No features assigned.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            <span>Delete Data</span>
          </button>
          <Link
            href={`/role-access/role-management/edit/${encodeURIComponent(role.id)}`}
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            <Pencil className="h-4 w-4" aria-hidden />
            <span>Edit Data</span>
          </Link>
        </div>
      </>
    );
  };

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="w-64 shrink-0" aria-hidden />

        <main className="flex-1 min-h-screen bg-slate-100">
          <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <div className="space-y-4 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-4">
              <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link
                  href="/role-access/role-management"
                  aria-label="Back to Role Management"
                  className="inline-flex items-center gap-1 rounded hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Role Management
                </Link>
                <span className="text-slate-400">/</span>
                <span className="font-medium text-slate-700">Role Detail</span>
              </nav>

              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this role?"
        description="This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) setConfirmOpen(false);
        }}
      />
    </div>
  );
}