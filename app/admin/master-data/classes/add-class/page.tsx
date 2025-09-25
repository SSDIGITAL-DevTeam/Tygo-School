"use client";

import React, { useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../../components/admin/Sidebar";
import Header from "../../../../../components/layout-global/Header";
import { ArrowLeft, GraduationCap, Plus, Save, Trash2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const homeroomTeacherOptions = [
  "Dafa Aulia",
  "Ryan Kusuma",
  "Heriyanto",
  "Siti Rahma",
  "Adi Nugraha",
  "Laras Wibowo",
];

const subjectOptions = [
  "Mathematics",
  "English",
  "Science",
  "History",
  "Geography",
  "Programming",
];

const reportFormatOptions = [
  "Even Semester Report 2024/2025",
  "Odd Semester Report 2024/2025",
  "Portfolio Assessment 2024",
];

const AddClassesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [homeroomTeacher, setHomeroomTeacher] = useState("");
  const [classCapacity, setClassCapacity] = useState("");
  const [subjectSelections, setSubjectSelections] = useState<string[]>([""]);
  const [reportSelections, setReportSelections] = useState<string[]>([""]);

  const router = useRouter();

  const uniqueSubjectOptions = useMemo(() => subjectOptions, []);
  const uniqueReportOptions = useMemo(() => reportFormatOptions, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form submit handling will be implemented later.
    console.log("Submitting add class form", {
      className,
      homeroomTeacher,
      classCapacity,
      subjects: subjectSelections,
      reports: reportSelections,
    });
  };

  const addSubjectSelect = () => {
    setSubjectSelections((prev) => [...prev, ""]);
  };

  const updateSubject = (index: number, value: string) => {
    setSubjectSelections((prev) => {
      if (value && prev.some((v, i) => i !== index && v === value)) {
        return prev; // abaikan jika sudah dipakai dropdown lain
      }
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const removeSubject = (index: number) => {
    setSubjectSelections((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const addReportSelect = () => {
    setReportSelections((prev) => [...prev, ""]);
  };

  const updateReport = (index: number, value: string) => {
    setReportSelections((prev) => {
      if (value && prev.some((v, i) => i !== index && v === value)) {
        return prev; // abaikan jika sudah dipakai dropdown lain
      }
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const removeReport = (index: number) => {
    setReportSelections((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const selectedSubjectSet = useMemo(
    () => new Set(subjectSelections.filter(Boolean)),
    [subjectSelections]
  );
  const selectedReportSet = useMemo(
    () => new Set(reportSelections.filter(Boolean)),
    [reportSelections]
  );

  const allSubjectsChosen =
    selectedSubjectSet.size >= uniqueSubjectOptions.length;
  const allReportsChosen = selectedReportSet.size >= uniqueReportOptions.length;

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
              <span className="text-gray-500">Manage Classes</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">Add Classes</span>
            </nav>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#6c2bd9] transition hover:bg-purple-50"
                  aria-label="Back to previous page"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#6c2bd9]">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Add Classes
                    </h1>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-6 pb-6 pt-5">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 rounded-2xl border border-gray-200 bg-[#f8f9ff] px-6 py-6"
                >
                  <div className="space-y-5">
                    <FormRow
                      label="Class Name"
                      required
                      input={
                        <input
                          type="text"
                          value={className}
                          onChange={(event) => setClassName(event.target.value)}
                          placeholder="Enter Class Name"
                          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                        />
                      }
                    />

                    <FormRow
                      label="Homeroom Teacher"
                      required
                      input={
                        <select
                          value={homeroomTeacher}
                          onChange={(event) =>
                            setHomeroomTeacher(event.target.value)
                          }
                          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                        >
                          <option value="" disabled>
                            Select Homeroom Teacher
                          </option>
                          {homeroomTeacherOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      }
                    />

                    <FormRow
                      label="Class Capacity (Optional)"
                      input={
                        <input
                          type="text"
                          inputMode="numeric"
                          value={classCapacity}
                          onChange={(event) => {
                            const nextValue = event.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            setClassCapacity(nextValue);
                          }}
                          placeholder="Input Class Capacity (Number Only)"
                          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                        />
                      }
                    />

                    <FormRow
                      label="Subjects"
                      input={
                        <div className="space-y-3">
                          {subjectSelections.map((value, index) => (
                            <div
                              key={`subject-${index}`}
                              className="flex w-full max-w-md items-center gap-2"
                            >
                              <select
                                value={value}
                                onChange={(event) =>
                                  updateSubject(index, event.target.value)
                                }
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                              >
                                <option value="" disabled>
                                  – Select Subject –
                                </option>
                                {uniqueSubjectOptions.map((option) => (
                                  <option
                                    key={option}
                                    value={option}
                                    disabled={
                                      selectedSubjectSet.has(option) &&
                                      option !== value
                                    }
                                  >
                                    {option}
                                  </option>
                                ))}
                              </select>
                              {subjectSelections.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSubject(index)}
                                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-[#6c2bd9] hover:text-[#6c2bd9]"
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
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#6c2bd9] transition hover:bg-purple-50"
                          >
                            <Plus className="h-4 w-4" />
                            Add Subject
                          </button>
                        </div>
                      }
                    />

                    <FormRow
                      label="Student Report Format"
                      input={
                        <div className="space-y-3">
                          {reportSelections.map((value, index) => (
                            <div
                              key={`report-${index}`}
                              className="flex w-full max-w-md items-center gap-2"
                            >
                              <select
                                value={value}
                                onChange={(event) =>
                                  updateReport(index, event.target.value)
                                }
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                              >
                                <option value="" disabled>
                                  – Select Report Format –
                                </option>
                                {uniqueReportOptions.map((option) => (
                                  <option
                                    key={option}
                                    value={option}
                                    disabled={
                                      selectedReportSet.has(option) &&
                                      option !== value
                                    }
                                  >
                                    {option}
                                  </option>
                                ))}
                              </select>
                              {reportSelections.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeReport(index)}
                                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-[#6c2bd9] hover:text-[#6c2bd9]"
                                  aria-label="Remove report format"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addReportSelect}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#6c2bd9] transition hover:bg-purple-50"
                          >
                            <Plus className="h-4 w-4" />
                            Add Report Format
                          </button>
                        </div>
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5922b8]"
                    >
                      <Save className="h-4 w-4" />
                      Save Data
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

const FormRow: React.FC<{
  label: string;
  required?: boolean;
  input: React.ReactNode;
}> = ({ label, required, input }) => (
  <label className="grid items-center gap-3 text-sm md:grid-cols-[200px,1fr]">
    <span className="justify-self-end text-right font-medium text-gray-700 after:ml-1 after:content-[':']">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>
    <div className="min-w-0">{input}</div>
  </label>
);

export default AddClassesPage;
