"use client";
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Topbar from "../../../../../../components/Topbar";
import Toast from "../../../../../../components/Toast";
import { Inter } from "next/font/google";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Shield } from "lucide-react";
import { z } from "zod";

const inter = Inter({ subsets: ["latin"] });

type AdminForm = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Secondary Admin" | "Subjects and Teachers Admin" | "Students Report Admin";
  status: "Active" | "Non Active";
};

const formSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  role: z.enum(["Admin", "Secondary Admin", "Subjects and Teachers Admin", "Students Report Admin"]),
  status: z.enum(["Active", "Non Active"]),
});

// Demo fallback (hapus kalau sudah pakai API beneran)
const ADMIN_DB: Record<string, AdminForm> = {
  meijiko: { id: "meijiko", name: "Meijiko", email: "meijiko@gmail.com", role: "Admin", status: "Active" },
  dafa: { id: "dafa", name: "Dafa Aulia", email: "dafa.aulia@example.com", role: "Admin", status: "Non Active" },
};

export default function EditAdminFromListPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const id = useMemo(() => String((params as any)?.id || ""), [params]);

  // state
  const [form, setForm] = useState<AdminForm>({
    id,
    name: "",
    email: "",
    role: "Admin",
    status: "Active",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AdminForm, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // helper
  const update = <K extends keyof AdminForm>(key: K, value: AdminForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // PRE-FILL dari URL (opsional): ?name=...&email=...&role=...&status=...
  const urlPrefill = useMemo(() => {
    const name = searchParams.get("name") || undefined;
    const email = searchParams.get("email") || undefined;
    const role = (searchParams.get("role") as AdminForm["role"]) || undefined;
    const status = (searchParams.get("status") as AdminForm["status"]) || undefined;
    if (name || email || role || status) {
      return { name, email, role, status };
    }
    return null;
  }, [searchParams]);

  // LOAD: API -> URL prefill -> ADMIN_DB -> error
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) {
        setLoadError("Invalid admin id");
        setLoading(false);
        return;
      }
      setLoading(true);
      setLoadError(null);

      // 1) API
      try {
        const res = await fetch(`/api/admins/${encodeURIComponent(id)}`, { cache: "no-store" });
        if (res.ok) {
          const raw = await res.json();
          if (cancelled) return;
          setForm((f) => ({
            id,
            name: raw.name ?? f.name ?? "",
            email: raw.email ?? f.email ?? "",
            role: (raw.role ?? f.role ?? "Admin") as AdminForm["role"],
            status: (raw.status ?? f.status ?? "Active") as AdminForm["status"],
          }));
          setLoading(false);
          return;
        }
      } catch {
        // ignore, lanjut ke prefill/fallback
      }

      // 2) URL prefill (mis. push dari list dengan query)
      if (urlPrefill) {
        if (cancelled) return;
        setForm((f) => ({
          id,
          name: urlPrefill.name ?? f.name,
          email: urlPrefill.email ?? f.email,
          role: (urlPrefill.role ?? f.role) as AdminForm["role"],
          status: (urlPrefill.status ?? f.status) as AdminForm["status"],
        }));
        setLoading(false);
        return;
      }

      // 3) Fallback DEMO
      const fallback = ADMIN_DB[id];
      if (fallback) {
        if (cancelled) return;
        setForm(fallback);
        setLoading(false);
        return;
      }

      // 4) Error (jangan kosongkan form yang sudah ada)
      if (!cancelled) {
        setLoadError("Admin not found");
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, urlPrefill]);

  const validate = (): boolean => {
    const res = formSchema.safeParse(form);
    if (res.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Partial<Record<keyof AdminForm, string>> = {};
    for (const issue of res.error.issues) {
      const k = issue.path[0] as keyof AdminForm;
      fieldErrors[k] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    setSaving(true);

    try {
      // Ganti ke API beneran kalau sudah siap:
      // await fetch(`/api/admins/${encodeURIComponent(form.id)}`, {
      //   method: "PATCH",
      //   headers: { "content-type": "application/json" },
      //   body: JSON.stringify({ name: form.name, email: form.email, role: form.role, status: form.status }),
      // });

      setToastMsg("Admin updated");
      setTimeout(() => router.push("/role-access/admin-list"), 600);
    } catch (err: any) {
      setToastMsg(err?.message || "Failed to update admin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        {/* Sidebar fixed + spacer */}
        <Sidebar isOpen={false} />
        <div className="w-64 shrink-0" aria-hidden />

        {/* Content */}
        <div className="flex-1 min-h-screen bg-slate-100">
          <Topbar offset={false} />

          <main className="p-4 md:p-6 lg:p-8">
            {/* Breadcrumb */}
            <div className="max-w-6xl mx-auto text-sm text-gray-600 mb-4">
              <Link href="/role-access/admin-list" className="hover:underline">Admin List</Link>
              <span className="text-gray-400"> / </span>
              <span className="text-gray-900">Edit Admin</span>
            </div>

            {/* HEADER STRIP */}
            <div className="max-w-6xl mx-auto mb-5 rounded-2xl bg-[#F3F4F6] border border-gray-200">
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="p-2 rounded-md hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    aria-label="Back"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-purple-100 grid place-content-center">
                    <Shield className="w-4 h-4 text-[#6c2bd9]" />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">Edit Admin</h1>
                    {!loading && form.name && (
                      <p className="text-sm text-gray-500 -mt-0.5">{form.name}</p>
                    )}
                  </div>
                </div>

                {!loading && (
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      form.status === "Active" ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {form.status}
                  </span>
                )}
              </div>
            </div>

            {/* FORM CARD */}
            <form onSubmit={onSubmit} className="max-w-6xl mx-auto rounded-2xl bg-white border border-gray-200 p-5 md:p-6 lg:p-7">
              {loadError && (
                <div className="mb-4 text-sm text-rose-600">
                  {loadError} — cek kembali ID dari list / API.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 md:gap-y-5 md:gap-x-6 items-center">
                {/* Admin Name */}
                <label htmlFor="name" className="md:col-span-3 text-sm text-gray-700 md:text-right md:pr-2">
                  Admin Name :
                </label>
                <div className="md:col-span-6">
                  <input
                    id="name"
                    type="text"
                    placeholder="Admin Name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    disabled={loading}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                </div>
                <div className="hidden md:block md:col-span-3" />

                {/* Email */}
                <label htmlFor="email" className="md:col-span-3 text-sm text-gray-700 md:text-right md:pr-2">
                  Email :
                </label>
                <div className="md:col-span-6">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    disabled={loading}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                </div>
                <div className="hidden md:block md:col-span-3" />

                {/* Role */}
                <label htmlFor="role" className="md:col-span-3 text-sm text-gray-700 md:text-right md:pr-2">
                  Role :
                </label>
                <div className="md:col-span-6">
                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) => update("role", e.target.value as AdminForm["role"])}
                    className="w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    disabled={loading}
                  >
                    {["Admin", "Secondary Admin", "Subjects and Teachers Admin", "Students Report Admin"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="hidden md:block md:col-span-3" />

                {/* Status */}
                <label className="md:col-span-3 text-sm text-gray-700 md:text-right md:pr-2">
                  Status :
                </label>
                <div className="md:col-span-6 flex items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.status === "Active"}
                    onClick={() => update("status", form.status === "Active" ? "Non Active" : "Active")}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        update("status", form.status === "Active" ? "Non Active" : "Active");
                      }
                    }}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                      form.status === "Active" ? "bg-[#6c2bd9]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        form.status === "Active" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="ml-3 text-sm text-gray-700">
                    {form.status === "Active" ? "Active" : "Non Active"}
                  </span>
                </div>
                <div className="hidden md:block md:col-span-3" />
              </div>

              {/* Save */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5B21B6] px-5 py-2 text-white font-semibold hover:bg-[#4C1D95] active:scale-95 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-300"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Data</span>
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>

      <Toast message={toastMsg || ""} show={!!toastMsg} onClose={() => setToastMsg(null)} />
    </div>
  );
}
