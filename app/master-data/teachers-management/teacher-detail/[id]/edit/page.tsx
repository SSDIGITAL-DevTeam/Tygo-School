"use client";

import React, { useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../../components/Sidebar";
import Header from "../../../../../../components/Header";
import ToggleSwitch from "../../../../../../components/ToggleSwitch";
import ConfirmDialog from "../../../../../../components/ConfirmDialog";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";
import {
  getTeacherById,
  PHONE_PREFIXES,
  SUBJECT_OPTIONS,
  TeacherStatus,
} from "../../../teacher-data";

const inter = Inter({ subsets: ["latin"] });

const TEACHER_LIST_PATH = "/master-data/teachers-management/teacher-list";

const AddTagButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#6c2bd9] text-[#6c2bd9] transition hover:bg-purple-50"
    aria-label="Add another option"
  >
    <Plus className="h-4 w-4" />
  </button>
);

const TeacherEditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const teacherId = useMemo(() => decodeURIComponent(String(params?.id ?? "")), [params]);
  const teacher = useMemo(() => getTeacherById(teacherId), [teacherId]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!teacher) {
    return (
      <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
        <div className="flex">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <div className="flex-1 min-h-screen flex flex-col">
            <Header onToggleSidebar={() => setSidebarOpen((value) => !value)} />
            <main className="relative z-0 ml-64 p-4 md:p-6 lg:p-8">
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">Teacher Not Found</h1>
                <p className="mt-2 text-sm text-gray-600">We couldn't locate the requested teacher. Please return to the teacher list.</p>
                <button
                  type="button"
                  onClick={() => router.push(TEACHER_LIST_PATH)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-5 py-2 text-sm font-semibold text-white hover:bg-[#581c87]"
                >
                  Back to List
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  const [teacherIdState, setTeacherIdState] = useState(teacher.id);
  const [fullName, setFullName] = useState(teacher.fullName);
  const [email, setEmail] = useState(teacher.email);
  const [phonePrefix, setPhonePrefix] = useState(teacher.phonePrefix ?? PHONE_PREFIXES[0]);
  const [phoneNumber, setPhoneNumber] = useState(teacher.phoneNumber ?? "");
  const [status, setStatus] = useState<TeacherStatus>(teacher.status);
  const [subjectSelections, setSubjectSelections] = useState<string[]>(
    teacher.subjects.length ? teacher.subjects : [""]
  );

  const availableSubjects = useMemo(() => SUBJECT_OPTIONS, []);
  const selectedSet = useMemo(
    () => new Set(subjectSelections.filter(Boolean)),
    [subjectSelections]
  );

  const addSubjectField = () => setSubjectSelections((prev) => [...prev, ""]);
  const removeSubjectAt = (index: number) =>
    setSubjectSelections((prev) => prev.filter((_, i) => i !== index));
  const updateSubjectAt = (index: number, value: string) => {
    setSubjectSelections((prev) => {
      if (value && prev.some((item, i) => i !== index && item === value)) {
        return prev;
      }
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowConfirm(true);
  };

  const confirmUpdate = () => {
    setShowConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    // Demo only: log payload to console
    const payload = {
      id: teacherIdState,
      fullName,
      email,
      phone: { prefix: phonePrefix, number: phoneNumber },
      status,
      subjects: subjectSelections.filter(Boolean),
    };
    console.log("Teacher updated", payload);
  };

  const breadcrumb = (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
      <ol className="flex items-center gap-2">
        <li>Master Data</li>
        <li aria-hidden className="text-gray-400">/</li>
        <li>Manage Teachers</li>
        <li aria-hidden className="text-gray-400">/</li>
        <li>Teacher Detail</li>
        <li aria-hidden className="text-gray-400">/</li>
        <li className="text-gray-900 font-medium">Edit Teacher</li>
      </ol>
    </nav>
  );

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 min-h-screen flex flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((value) => !value)} />
          <main className="relative z-0 ml-64 p-4 md:p-6 lg:p-8 space-y-6">
            {breadcrumb}
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="mt-1 rounded-md p-2 text-gray-500 transition hover:bg-gray-100"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#efe7ff] text-[#6c2bd9]">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">Edit Teacher</h1>
                    <p className="text-sm text-gray-500">{teacher.fullName}</p>
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold ${
                  status === "Active"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                    : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20"
                }`}
              >
                {status}
              </span>
            </section>

            {saved && (
              <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>Changes saved locally (preview mode).</span>
              </div>
            )}

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="grid gap-6">
                  <FieldRow
                    label="Teacher ID"
                    element={
                      <input
                        value={teacherIdState}
                        onChange={(event) => setTeacherIdState(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                      />
                    }
                  />
                  <FieldRow
                    label="Full Name"
                    element={
                      <input
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                      />
                    }
                  />
                  <FieldRow
                    label="Email"
                    element={
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                      />
                    }
                  />
                  <FieldRow
                    label="Subject Specialization"
                    element={
                      <div className="flex flex-col gap-3">
                        {subjectSelections.map((value, index) => (
                          <div key={index} className="flex flex-wrap items-center gap-2">
                            <select
                              value={value}
                              onChange={(event) => updateSubjectAt(index, event.target.value)}
                              className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                            >
                              <option value="" disabled hidden>
                                Select Subject
                              </option>
                              {availableSubjects.map((subjectOption) => (
                                <option
                                  key={subjectOption}
                                  value={subjectOption}
                                  disabled={
                                    selectedSet.has(subjectOption) && subjectOption !== value
                                  }
                                >
                                  {subjectOption}
                                </option>
                              ))}
                            </select>
                            {subjectSelections.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSubjectAt(index)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:text-rose-500"
                                aria-label="Remove subject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <AddTagButton onClick={addSubjectField} />
                      </div>
                    }
                  />
                  <FieldRow
                    label="Phone Number (optional)"
                    element={
                      <div className="flex w-full max-w-md items-center gap-2">
                        <select
                          value={phonePrefix}
                          onChange={(event) => setPhonePrefix(event.target.value)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                        >
                          {PHONE_PREFIXES.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <input
                          value={phoneNumber}
                          onChange={(event) => setPhoneNumber(event.target.value.replace(/[^0-9 -]/g, ""))}
                          placeholder="Enter Phone Number"
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                        />
                      </div>
                    }
                  />
                  <FieldRow
                    label="Status"
                    element={
                      <ToggleSwitch
                        id="teacher-status"
                        label="Status"
                        className="[&_label]:sr-only"
                        checked={status === "Active"}
                        onChange={(checked) => setStatus(checked ? "Active" : "Non Active")}
                      />
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#581c87]"
                  >
                    Save Data
                  </button>
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Save changes?"
        description="Updates will be stored locally in this prototype."
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={confirmUpdate}
        onClose={() => setShowConfirm(false)}
      />
    </div>
  );
};

type FieldRowProps = {
  label: string;
  element: React.ReactNode;
};

const FieldRow: React.FC<FieldRowProps> = ({ label, element }) => (
  <label className="grid items-center gap-3 text-sm md:grid-cols-[180px,1fr]">
    <span className="justify-self-end text-right font-medium text-gray-700 whitespace-nowrap after:content-[':'] after:ml-1">
      {label}
    </span>
    <div className="min-w-0">{element}</div>
  </label>
);

export default TeacherEditPage;
