"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/layout-global/Topbar";
import PageHeader from "@/components/layout-global/PageHeader";

import { Inter } from "next/font/google";
import { ChevronLeft, Shield, Save, Loader2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const FEATURE_OPTIONS = [
  { id: "subjects", label: "Subjects Management" },
  { id: "teachers", label: "Teachers Management" },
  { id: "classes", label: "Classes Management" },
  { id: "reports", label: "Students Report Management" },
  { id: "payment", label: "Payment Administration" },
  { id: "settings", label: "School Settings" },
] as const;

type RoleForm = {
  name: string;
  features: string[];
  active: boolean;
};

type Errors = {
  name?: string;
};

export default function AddRolePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState<RoleForm>({ name: "", features: [], active: true });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const dirty = useMemo(() => form.name.trim().length > 0, [form]);

  const toggleFeature = (id: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter((f) => f !== id)
        : [...prev.features, id],
    }));
  };

  const validate = (): boolean => {
    const trimmed = form.name.trim();
    const next: Errors = {};
    if (trimmed.length < 3) {
      next.name = "Role name must be at least 3 characters";
    } else if (!/^[- a-zA-Z0-9]+$/.test(trimmed)) {
      next.name = "Only letters, numbers, spaces, and dashes allowed";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim() }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        if (res.status === 409) {
          setErrors({ name: payload?.message || "Role name already exists" });
        } else {
          throw new Error(payload?.message || "Failed to create role");
        }
        return;
      }

      alert("Role created successfully");
      router.push("/admin/role-access/role-management");
    } catch (err: any) {
      alert(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="w-64 shrink-0" aria-hidden />

        <main className="min-h-screen flex-1 bg-slate-100">
          {/* Topbar pakai offset={false} karena kita sudah pakai spacer w-64 di kiri */}
          <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <div className="p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link
                  href="/admin/role-access/role-management"
                  className="inline-flex items-center gap-1 rounded hover:text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  aria-label="Back to Role Management"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Role Management
                </Link>
                <span className="text-slate-400">/</span>
                <span className="font-medium text-slate-700">Add Role</span>
              </nav>

              {/* Page header reusable */}
              <PageHeader
                title="Add Role"
                icon={<Shield className="h-5 w-5 text-violet-700" aria-hidden />}
              />

              {/* Form card */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-12">
                  {/* Role Name */}
                  <label
                    htmlFor="role-name"
                    className="md:col-span-3 flex items-center justify-end text-sm text-slate-700 md:pr-4"
                  >
                    Role Name :
                  </label>
                  <div className="md:col-span-7">
                    <input
                      id="role-name"
                      type="text"
                      placeholder="Enter Role Name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-rose-600" aria-live="polite">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <span className="md:col-span-3 flex items-start justify-end pt-1 text-sm text-slate-700 md:pr-4">
                    Accessible Features :
                  </span>
                  <div className="md:col-span-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {FEATURE_OPTIONS.map(({ id, label }) => (
                      <label key={id} htmlFor={`feature-${id}`} className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                          id={`feature-${id}`}
                          type="checkbox"
                          checked={form.features.includes(id)}
                          onChange={() => toggleFeature(id)}
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Submit */}
                  <div className="md:col-span-7 md:col-start-4 flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading || !dirty}
                      className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition active:scale-95 hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
                      <span>Save Data</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
