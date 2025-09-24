"use client";
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import UploadLogo from "../../components/UploadLogo";
import Toast from "../../components/Toast";
import { Inter } from "next/font/google";
import { Settings, Save } from "lucide-react";
import { z } from "zod";

const inter = Inter({ subsets: ["latin"] });

type FormState = {
  logo: File | string | null;
  schoolName: string;
  schoolAddress: string;
  language: "English" | "Bahasa Indonesia";
  currency: "IDR" | "USD" | "SGD" | "EUR";
};

const schema = z.object({
  logo: z.any().nullable(),
  schoolName: z.string().min(3, "Minimum 3 characters"),
  schoolAddress: z.string().min(5, "Minimum 5 characters"),
  language: z.enum(["English", "Bahasa Indonesia"]),
  currency: z.enum(["IDR", "USD", "SGD", "EUR"]),
});

const DEFAULT_FORM: FormState = {
  logo: null,
  schoolName: "Citra Budaya School",
  schoolAddress: "Jl. Mangga, No 65, Jakarta",
  language: "English",
  currency: "IDR",
};

export default function SchoolSettingsPage() {
  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form / loading state
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [initialForm, setInitialForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant?: "success" | "error" } | null>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);

  // Fetch initial settings (API first, fallback to defaults)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (process.env.NEXT_PUBLIC_USE_API === "1") {
          const res = await fetch("/api/settings");
          if (res.ok) {
            const raw = await res.json();
            const data: FormState = {
              logo: raw.logo ?? null,
              schoolName: raw.schoolName ?? DEFAULT_FORM.schoolName,
              schoolAddress: raw.schoolAddress ?? DEFAULT_FORM.schoolAddress,
              language: (raw.language ?? DEFAULT_FORM.language) as FormState["language"],
              currency: (raw.currency ?? DEFAULT_FORM.currency) as FormState["currency"],
            };
            if (!cancelled) {
              setForm(data);
              setInitialForm(data);
            }
          } else {
            if (!cancelled) {
              setForm(DEFAULT_FORM);
              setInitialForm(DEFAULT_FORM);
            }
          }
        } else {
          if (!cancelled) {
            setForm(DEFAULT_FORM);
            setInitialForm(DEFAULT_FORM);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setForm(DEFAULT_FORM);
          setInitialForm(DEFAULT_FORM);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const res = schema.safeParse(form);
    if (res.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Partial<Record<keyof FormState, string>> = {};
    for (const issue of res.error.issues) {
      const k = issue.path[0] as keyof FormState;
      fieldErrors[k] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (process.env.NEXT_PUBLIC_USE_API === "1") {
        const formData = new FormData();
        formData.append("schoolName", form.schoolName.trim());
        formData.append("schoolAddress", form.schoolAddress.trim());
        formData.append("language", form.language);
        formData.append("currency", form.currency);
        if (form.logo instanceof File) formData.append("logo", form.logo);
        await fetch("/api/school-settings", { method: "PATCH", body: formData });
      } else {
        console.log("Saving school settings", form);
      }
      setInitialForm(form);
      setToast({ message: "School settings saved", variant: "success" });
    } catch (err: any) {
      setToast({ message: err?.message || "Failed to save settings", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="w-64 shrink-0" aria-hidden />

        <div className="flex-1 min-h-screen bg-slate-100 relative z-0">
          <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((s) => !s)} />
          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header card */}
            <div className="max-w-screen-xl mx-auto">
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 grid place-content-center">
                  <Settings className="w-5 h-5 text-[#6c2bd9]" aria-hidden />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">School Settings</h1>
              </div>
            </div>

            {/* Form card */}
            <div className="max-w-screen-xl mx-auto rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Upload logo row */}
                <div className="grid grid-cols-1 md:grid-cols-12 md:items-start gap-3">
                  <div className="md:col-span-3 text-sm text-slate-700 md:text-right md:pr-4">
                    School Logo <span className="text-xs text-gray-500">(Optional)</span>
                  </div>
                  <div className="md:col-span-7 space-y-1">
                    <UploadLogo value={form.logo} onChange={(v) => setField("logo", v)} disabled={saving} />
                  </div>
                </div>

                {/* School Name */}
                <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-3">
                  <label htmlFor="schoolName" className="md:col-span-3 text-sm text-slate-700 md:text-right md:pr-4">School Name<span className="hidden md:inline"> :</span></label>
                  <div className="md:col-span-7">
                    <input
                      id="schoolName"
                      type="text"
                      placeholder="Citra Budaya School"
                      value={form.schoolName}
                      onChange={(e) => setField("schoolName", e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                      aria-invalid={!!errors.schoolName}
                    />
                    {errors.schoolName && <p className="mt-1 text-xs text-rose-600" aria-live="polite">{errors.schoolName}</p>}
                  </div>
                </div>

                {/* School Address */}
                <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-3">
                  <label htmlFor="schoolAddress" className="md:col-span-3 text-sm text-slate-700 md:text-right md:pr-4">School Address<span className="hidden md:inline"> :</span></label>
                  <div className="md:col-span-7">
                    <input
                      id="schoolAddress"
                      type="text"
                      placeholder="Jl. Mangga, No 65, Jakarta"
                      value={form.schoolAddress}
                      onChange={(e) => setField("schoolAddress", e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                      aria-invalid={!!errors.schoolAddress}
                    />
                    {errors.schoolAddress && <p className="mt-1 text-xs text-rose-600">{errors.schoolAddress}</p>}
                  </div>
                </div>

                {/* Language */}
                <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-3">
                  <label htmlFor="language" className="md:col-span-3 text-sm text-slate-700 md:text-right md:pr-4">System Default Language<span className="hidden md:inline"> :</span></label>
                  <div className="md:col-span-7">
                    <select
                      id="language"
                      value={form.language}
                      onChange={(e) => setField("language", e.target.value as FormState["language"])}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                    >
                      <option value="English">English</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    </select>
                  </div>
                </div>

                {/* Currency */}
                <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-3">
                  <label htmlFor="currency" className="md:col-span-3 text-sm text-slate-700 md:text-right md:pr-4">Currency Used<span className="hidden md:inline"> :</span></label>
                  <div className="md:col-span-7">
                    <select
                      id="currency"
                      value={form.currency}
                      onChange={(e) => setField("currency", e.target.value as FormState["currency"])}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                    >
                      <option value="IDR">Indonesia Rupiah (IDR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="SGD">Singapore Dollar (SGD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving || !dirty || loading}
                    className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-white font-semibold hover:bg-violet-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400"
                  >
                    {saving ? <Save className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Data</span>
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      <Toast message={toast?.message || ""} show={!!toast} onClose={() => setToast(null)} />
    </div>
  );
}

