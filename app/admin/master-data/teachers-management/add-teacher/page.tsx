"use client";

import React, { useMemo, useState } from "react";
import Sidebar from "../../../../../components/admin/Sidebar";
import Header from "../../../../../components/layout-global/Header";
import ConfirmModal from "../../../../../components/modal/AddTeacherModal";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const TEACHER_LIST_PATH = "/master-data/teachers-management/teacher-list";

const subjectOptions = [
  "Math 01",
  "Math 02",
  "English 01",
  "English 02",
  "Science 01",
  "Programming 01",
  "Programming 02",
  "Art 01",
  "Biology 01",
];

const phonePrefixes = ["+62", "+60", "+65", "+91"];

const AddTeacherPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [teacherId, setTeacherId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonePrefix, setPhonePrefix] = useState(phonePrefixes[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [subjectSelections, setSubjectSelections] = useState<string[]>([""]);

  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedSet = useMemo(
    () => new Set(subjectSelections.filter(Boolean)),
    [subjectSelections]
  );

  const router = useRouter();

  const resetForm = () => {
    setTeacherId("");
    setFullName("");
    setEmail("");
    setPassword("");
    setPhonePrefix(phonePrefixes[0]);
    setPhoneNumber("");
    setSubjectSelections([""]);
  };

  const addSubjectSelect = () => setSubjectSelections((prev) => [...prev, ""]);
  const removeSubjectSelect = (index: number) =>
    setSubjectSelections((prev) => prev.filter((_, i) => i !== index));

  const updateSubjectAt = (index: number, value: string) => {
    setSubjectSelections((prev) => {
      if (value && prev.some((s, i) => i !== index && s === value)) return prev;
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleConfirm = () => {
    const chosenSubjects = Array.from(
      new Set(subjectSelections.filter((s) => s && s !== ""))
    );
    const payload = {
      teacherId,
      fullName,
      email,
      password,
      phone: `${phonePrefix} ${phoneNumber}`.trim(),
      subjects: chosenSubjects,
      createdAt: Date.now(),
    };

    const KEY = "teachers";
    const prev = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    localStorage.setItem(KEY, JSON.stringify([...prev, payload]));

    setModalOpen(false);
    router.push(TEACHER_LIST_PATH);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    resetForm();
  };

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 min-h-screen flex flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <main className="md:ml-64 p-4 md:p-6 lg:p-8">
            {/* Breadcrumb */}
            <nav className="mb-5 text-sm text-gray-500" aria-label="Breadcrumb">
              <span className="text-gray-400">Master Data</span>
              <span className="mx-2">/</span>
              <span className="text-gray-400">Manage Teachers</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">Add Teacher</span>
            </nav>

            {/* Card utama (sama seperti Add Subject) */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Header card */}
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                  aria-label="Back to teacher list"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#6c2bd9]">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Add Teacher</h1>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 pb-8 pt-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  {/* strip tipis atas */}
                  <div className="h-3 -mx-6 -mt-6 mb-6 rounded-t-2xl bg-gray-100" />

                  {/* konten form terpusat */}
                  <div className="mx-auto w-full max-w-[860px]">
                    <FormRow
                      label="Teacher ID"
                      required
                      input={
                        <input
                          value={teacherId}
                          onChange={(e) => setTeacherId(e.target.value)}
                          placeholder="Enter Teacher ID"
                          className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                          required
                        />
                      }
                    />

                    <FormRow
                      label="Full Name"
                      required
                      input={
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter Full Name"
                          className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                          required
                        />
                      }
                    />

                    <FormRow
                      label="Email"
                      required
                      input={
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter Email"
                          className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                          required
                        />
                      }
                    />

                    <FormRow
                      label="Password"
                      required
                      input={
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter Password"
                          className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                          required
                        />
                      }
                    />

                    <FormRow
                      label="Subject Specialization"
                      required
                      input={
                        <div className="space-y-3 w-full max-w-md">
                          {subjectSelections.map((value, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <select
                                value={value}
                                onChange={(e) => updateSubjectAt(idx, e.target.value)}
                                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                              >
                                <option value="" disabled>
                                  – Select Subject –
                                </option>
                                {subjectOptions.map((subject) => (
                                  <option
                                    key={subject}
                                    value={subject}
                                    disabled={selectedSet.has(subject) && subject !== value}
                                  >
                                    {subject}
                                  </option>
                                ))}
                              </select>
                              {subjectSelections.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSubjectSelect(idx)}
                                  className="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-500 transition hover:border-[#6c2bd9] hover:text-[#6c2bd9]"
                                  aria-label="Remove subject"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addSubjectSelect}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#6c2bd9] transition hover:bg-purple-50"
                          >
                            <Plus className="h-4 w-4" />
                            Add Subject
                          </button>
                        </div>
                      }
                    />

                    <FormRow
                      label="Phone Number (Optional)"
                      input={
                        <div className="flex w-full max-w-md items-center gap-2">
                          <select
                            value={phonePrefix}
                            onChange={(e) => setPhonePrefix(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                          >
                            {phonePrefixes.map((prefix) => (
                              <option key={prefix} value={prefix}>
                                {prefix}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onInput={(e) => {
                              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
                            }}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter Phone Number"
                            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                          />
                        </div>
                      }
                    />

                    {/* Baris tombol di kolom input (kanan) */}
                    <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="hidden md:block" />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#5922b8]"
                        >
                          <Save className="h-4 w-4" />
                          Save Data
                        </button>
                      </div>
                    </div>

                    {saved && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Teacher saved locally for preview (mock action).</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>

      <ConfirmModal
        open={modalOpen}
        title="Add Teacher?"
        description="Are you sure want to add this teacher?"
        icon={<BookOpen className="h-5 w-5" />}
        confirmLabel="Yes, Save"
        cancelLabel="No"
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

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

export default AddTeacherPage;