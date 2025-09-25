"use client";

import React, { useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../../components/Sidebar";
import Header from "../../../../../components/Header";
import { ArrowLeft, BookOpen, Save } from "lucide-react";

type FieldState = {
  subjectCode: string;
  subjectName: string;
  description: string;
};

const inter = Inter({ subsets: ["latin"] });

const initialState: FieldState = {
  subjectCode: "",
  subjectName: "",
  description: "",
};

const AddSubjectPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState<FieldState>(initialState);
  const router = useRouter();

  const isDirty = useMemo(() => {
    return (
      form.subjectCode.trim() !== "" ||
      form.subjectName.trim() !== "" ||
      form.description.trim() !== ""
    );
  }, [form]);

  const handleChange =
    (field: keyof FieldState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: integrate with backend
    alert("Data has been saved (mock).");
  };

  // --- tambahkan di atas komponen AddSubjectPage ---
  const FormRow: React.FC<{
    label: string;
    required?: boolean;
    input: React.ReactNode;
  }> = ({ label, required, input }) => (
    <div className="grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[220px_minmax(0,1fr)]">
      {/* Label kanan + titik dua */}
      <label className="flex items-center justify-end pr-3 text-sm font-medium text-gray-700">
        <span className="text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
        <span className="ml-1 text-gray-400">:</span>
      </label>

      {/* Kolom input */}
      <div className="min-w-0">{input}</div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <main className="md:ml-64 p-4 md:p-6 lg:p-8">
            <nav className="mb-5 text-sm text-gray-500" aria-label="Breadcrumb">
              <span className="text-gray-400">Master Data</span>
              <span className="mx-2">/</span>
              <span className="text-gray-400">Manage Subjects</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">Add Subject</span>
            </nav>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                  aria-label="Back to subject list"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#6c2bd9]">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Add Subject
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="px-6 pb-8 pt-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  {/* strip tipis atas */}
                  <div className="h-3 -mx-6 -mt-6 mb-6 rounded-t-2xl bg-gray-100" />

                  {/* Pusatkan konten form */}
                  <div className="mx-auto w-full max-w-[860px]">
                    <FormRow
                      label="Subject Code"
                      required
                      input={
                        <input
                          id="subject-code"
                          type="text"
                          placeholder="Enter Subject Code"
                          value={form.subjectCode}
                          onChange={handleChange("subjectCode")}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                          required
                        />
                      }
                    />

                    <FormRow
                      label="Subject Name"
                      required
                      input={
                        <input
                          id="subject-name"
                          type="text"
                          placeholder="Enter Subject Name"
                          value={form.subjectName}
                          onChange={handleChange("subjectName")}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                          required
                        />
                      }
                    />

                    <FormRow
                      label="Description (Optional)"
                      input={
                        <textarea
                          id="description"
                          placeholder="Enter Description"
                          value={form.description}
                          onChange={handleChange("description")}
                          rows={4}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                        />
                      }
                    />

                    {/* Baris tombol ditempatkan di kolom input */}
                    <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="hidden md:block" />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#5922b8] disabled:cursor-not-allowed disabled:bg-purple-200"
                          disabled={!isDirty}
                        >
                          <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                          Save Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectPage;
