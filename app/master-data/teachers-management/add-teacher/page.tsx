"use client";

import React, { useMemo, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import Header from "../../../../components/Header";
import ConfirmModal from "../../../../components/modal/AddTeacherModal";
import { Inter } from "next/font/google";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

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

  const [selectedSubject, setSelectedSubject] = useState(subjectOptions[0]);
  const [subjects, setSubjects] = useState<string[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const subjectChoices = useMemo(() => subjectOptions, []);

  const addSubject = () => {
    if (!selectedSubject || subjects.includes(selectedSubject)) return;
    setSubjects((prev) => [...prev, selectedSubject]);
  };

  const removeSubject = (subject: string) => {
    setSubjects((prev) => prev.filter((item) => item !== subject));
  };

  const resetForm = () => {
    setTeacherId("");
    setFullName("");
    setEmail("");
    setPassword("");
    setPhonePrefix(phonePrefixes[0]);
    setPhoneNumber("");
    setSubjects([]);
    setSelectedSubject(subjectOptions[0]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalOpen(true);
  };

  const handleConfirm = () => {
    const payload = {
      teacherId,
      fullName,
      email,
      password,
      phone: `${phonePrefix} ${phoneNumber}`.trim(),
      subjects,
    };
    console.log("Saving teacher", payload);
    setModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    resetForm();
  };

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          active="Master Data"
        />

        <div className="flex-1 min-h-screen flex flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <main className="relative z-0 ml-64 p-4 md:p-6 lg:p-8">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
              <ol className="flex items-center gap-2">
                <li>Master Data</li>
                <li aria-hidden className="text-gray-400">
                  /
                </li>
                <li>Manage Teachers</li>
                <li aria-hidden className="text-gray-400">
                  /
                </li>
                <li className="font-medium text-gray-900">Add Teacher</li>
              </ol>
            </nav>

            <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Back to teacher list"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:border-[#6c2bd9] hover:text-[#6c2bd9]"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#efe7ff] text-[#6c2bd9]">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Add Teacher
                    </h1>
                    <p className="text-sm text-gray-500">
                      Fill in the teacher credentials before saving to the system.
                    </p>
                  </div>
                </div>
              </div>
              {saved && (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Teacher saved locally for preview (mock action).</span>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <FormRow
                    label="Teacher ID"
                    required
                    input={
                      <input
                        value={teacherId}
                        onChange={(event) => setTeacherId(event.target.value)}
                        placeholder="Enter Teacher ID"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                      />
                    }
                  />

                  <FormRow
                    label="Full Name"
                    required
                    input={
                      <input
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Enter Full Name"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
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
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter Email"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
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
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter Password"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                      />
                    }
                  />

                  <FormRow
                    label="Subject Specialization"
                    required
                    input={
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex w-full max-w-xs items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
                          <select
                            value={selectedSubject}
                            onChange={(event) => setSelectedSubject(event.target.value)}
                            className="flex-1 appearance-none bg-transparent px-3 py-2 text-sm text-gray-700 focus:outline-none"
                          >
                            {subjectChoices.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={addSubject}
                            className="h-full border-l border-gray-200 px-3 text-[#6c2bd9] transition-colors hover:bg-purple-50"
                            aria-label="Add subject"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {subjects.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {subjects.map((subject) => (
                              <span
                                key={subject}
                                className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#6c2bd9]"
                              >
                                {subject}
                                <button
                                  type="button"
                                  aria-label={`Remove ${subject}`}
                                  onClick={() => removeSubject(subject)}
                                  className="rounded-full p-0.5 text-[#6c2bd9]/70 hover:bg-purple-100 hover:text-[#581c87]"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    }
                  />

                  <FormRow
                    label="Phone Number (optional)"
                    input={
                      <div className="flex w-full max-w-md items-center gap-2">
                        <select
                          value={phonePrefix}
                          onChange={(event) => setPhonePrefix(event.target.value)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                        >
                          {phonePrefixes.map((prefix) => (
                            <option key={prefix} value={prefix}>
                              {prefix}
                            </option>
                          ))}
                        </select>
                        <input
                          value={phoneNumber}
                          onChange={(event) => setPhoneNumber(event.target.value)}
                          placeholder="Enter Phone Number"
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/40"
                        />
                      </div>
                    }
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-[#581c87] active:scale-[0.99]"
                  >
                    <Save className="h-4 w-4" />
                    Save Data
                  </button>
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
  <label
    className="grid gap-2 items-center text-sm md:grid-cols-[180px,1fr]" // 180px = lebar kolom label (atur sesuai selera)
  >
    {/* Label: rata kanan, dekat input, ada ':' otomatis */}
    <span className="justify-self-end text-right font-medium text-gray-700 whitespace-nowrap after:content-[':'] after:ml-1">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>

    {/* Input: isi sisa ruang */}
    <div className="min-w-0">{input}</div>
  </label>
);


export default AddTeacherPage;