"use client";
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import UploadLogo from "../../../components/UploadLogo";
import Toast from "../../../components/Toast";
import { Inter } from "next/font/google";
import { Settings, Save, ChevronDown } from "lucide-react";
import { z } from "zod";

type FormState = {
  logo: File | string | null;
  schoolName: string;
  schoolAddress: string;
  language: "English" | "Bahasa Indonesia";
  currency: "IDR" | "USD" | "SGD" | "EUR";
};

const inter = Inter({ subsets: ["latin"] });

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [initialForm, setInitialForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant?: "success" | "error" } | null>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm), [form, initialForm]);

  // Load initial settings from API (if enabled) and fall back to defaults.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (process.env.NEXT_PUBLIC_USE_API === "1") {
          const res = await fetch("/api/school-settings");
          if (res.ok) {
            const payload = await res.json();
            const next: FormState = {
              logo: payload.logo ?? null,
              schoolName: payload.schoolName ?? DEFAULT_FORM.schoolName,
              schoolAddress: payload.schoolAddress ?? DEFAULT_FORM.schoolAddress,
              language: (payload.language ?? DEFAULT_FORM.language) as FormState["language"],
              currency: (payload.currency ?? DEFAULT_FORM.currency) as FormState["currency"],
            };
            if (!cancelled) {
              setForm(next);
              setInitialForm({ ...next });
            }
          } else if (!cancelled) {
            setForm(DEFAULT_FORM);
            setInitialForm({ ...DEFAULT_FORM });
          }
        } else if (!cancelled) {
          setForm(DEFAULT_FORM);
          setInitialForm({ ...DEFAULT_FORM });
        }
      } catch {
        if (!cancelled) {
          setForm(DEFAULT_FORM);
          setInitialForm({ ...DEFAULT_FORM });
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

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const result = schema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Partial<Record<keyof FormState, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormState;
      fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

      setInitialForm({ ...form });
      setToast({ message: "School settings saved", variant: "success" });
    } catch (error: any) {
      setToast({ message: error?.message ?? "Failed to save settings", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="w-64 shrink-0" aria-hidden />

        <main className="flex-1 min-h-screen bg-slate-100">
          <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <div className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header card */}
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-purple-100">
                  <Settings className="h-5 w-5 text-[#6c2bd9]" aria-hidden />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">School Settings</h1>
              </div>
            </div>

            {/* Form card */}
            <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-12">
                {/* Logo uploader */}
                <div className="md:col-span-4 flex items-start justify-end">
                  <div className="text-sm font-medium text-slate-700 md:pr-4">School Logo <span className="text-xs font-medium text-gray-500">(Optional)</span></div>
                </div>
                <div className="md:col-span-8 space-y-1">
                  <UploadLogo value={form.logo} onChange={(value) => setField("logo", value)} disabled={saving} />
                </div>

                {/* School Name */}
                <label htmlFor="schoolName" className="md:col-span-4 flex items-center justify-end pr-0 text-sm font-medium text-slate-700 md:pr-4">
                  School Name
                  <span className="hidden md:inline"> :</span>
                </label>
                <div className="md:col-span-8">
                  <input
                    id="schoolName"
                    type="text"
                    placeholder="Citra Budaya School"
                    value={form.schoolName}
                    onChange={(event) => setField("schoolName", event.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    aria-invalid={!!errors.schoolName}
                  />
                  {errors.schoolName && (
                    <p className="mt-1 text-xs text-rose-600" aria-live="polite">
                      {errors.schoolName}
                    </p>
                  )}
                </div>

                {/* School Address */}
                <label htmlFor="schoolAddress" className="md:col-span-4 flex items-center justify-end pr-0 text-sm font-medium text-slate-700 md:pr-4">
                  School Address
                  <span className="hidden md:inline"> :</span>
                </label>
                <div className="md:col-span-8">
                  <input
                    id="schoolAddress"
                    type="text"
                    placeholder="Jl. Mangga, No 65, Jakarta"
                    value={form.schoolAddress}
                    onChange={(event) => setField("schoolAddress", event.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    aria-invalid={!!errors.schoolAddress}
                  />
                  {errors.schoolAddress && (
                    <p className="mt-1 text-xs text-rose-600" aria-live="polite">
                      {errors.schoolAddress}
                    </p>
                  )}
                </div>

                {/* Language */}
                <span className="md:col-span-4 flex items-center justify-end pr-0 text-sm font-medium text-slate-700 md:pr-4">
                  System Default Language
                  <span className="hidden md:inline"> :</span>
                </span>
                <div className="md:col-span-8">
                  <div className="relative">
                    <select
                      id="language"
                      value={form.language}
                      onChange={(event) => setField("language", event.target.value as FormState["language"])}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      <option value="English">English</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
                  </div>
                </div>

                {/* Currency */}
                <span className="md:col-span-4 flex items-center justify-end pr-0 text-sm font-medium text-slate-700 md:pr-4">
                  Currency Used
                  <span className="hidden md:inline"> :</span>
                </span>
                <div className="md:col-span-8">
                  <div className="relative">
                    <select
                      id="currency"
                      value={form.currency}
                      onChange={(event) => setField("currency", event.target.value as FormState["currency"])}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      <option value="IDR">Indonesia Rupiah (IDR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="SGD">Singapore Dollar (SGD)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
                  </div>
                </div>

                {/* Save button row */}
                <div className="md:col-span-8 md:col-start-5 flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving || !dirty || loading}
                    className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-6 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-[#5a23b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6c2bd9] disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
                  >
                    {saving ? (
                      <Save className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Save className="h-4 w-4" aria-hidden />
                    )}
                    <span>Save Data</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Toast message={toast?.message ?? ""} show={!!toast} onClose={() => setToast(null)} />
    </div>
  );
}
