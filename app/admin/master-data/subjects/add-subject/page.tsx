"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../../components/admin/Sidebar";
import Header from "../../../../../components/layout-global/Header";
import { ArrowLeft, BookOpen } from "lucide-react";
import SaveButton from "@/components/layout-global/SaveButton";
import AddSubjectModal from "@/components/admin/modal/AddModal";

type FieldState = {
  subjectCode: string;
  subjectName: string;
  description: string;
};

const inter = Inter({ subsets: ["latin"] });

/* ---------- MOVE FormRow OUTSIDE the component ---------- */
const FormRow = React.memo(function FormRow({
  label,
  required,
  input,
}: {
  label: string;
  required?: boolean;
  input: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[220px_minmax(0,1fr)]">
      <label className="flex items-center justify-end pr-3 text-sm font-medium text-gray-700">
        <span className="text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
        <span className="ml-1 text-gray-400">:</span>
      </label>
      <div className="min-w-0">{input}</div>
    </div>
  );
});
/* -------------------------------------------------------- */

const initialState: FieldState = {
  subjectCode: "",
  subjectName: "",
  description: "",
};

const AddSubjectPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState<FieldState>(initialState);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const isDirty = useMemo(
    () =>
      form.subjectCode.trim() !== "" ||
      form.subjectName.trim() !== "" ||
      form.description.trim() !== "",
    [form]
  );

  const handleChange =
    (field: keyof FieldState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const doSave = () => {
    console.log("Saving subject:", form);
    setShowAddModal(false);
    alert("Subject has been saved (mock).");
  };

  useEffect(() => {
    if (!showAddModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showAddModal]);

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
                <h1 className="text-xl font-semibold text-gray-900">Add Subject</h1>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="px-6 pb-8 pt-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="h-3 -mx-6 -mt-6 mb-6 rounded-t-2xl bg-gray-100" />

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

                    <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="hidden md:block" />
                      <div className="mt-2 flex justify-end">
                        <SaveButton
                          type="button"
                          disabled={!isDirty}
                          onClick={() => setShowAddModal(true)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>

      <AddSubjectModal
        open={showAddModal}
        msg={"subject"}
        onConfirm={doSave}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default AddSubjectPage;