"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../../../../components/admin/Sidebar";
import Header from "../../../../../components/layout-global/Header";
import StatusBadge from "../../../../../components/layout-global/StatusBadge";
import {
  ArrowLeft,
  ArrowUpDown,
  ClipboardList,
  Flag,
  GraduationCap,
  PenSquare,
  Search,
  Trash2,
} from "lucide-react";
import Pagination from "../../../../../components/layout-global/Pagination";
import { getClassDetailByName, StudentFlagColor } from "../class-data";

const inter = Inter({ subsets: ["latin"] });

const tabs = ["Subjects", "Students", "Student Report Format"] as const;
type TabKey = (typeof tabs)[number];

const flagColorMap: Record<StudentFlagColor, string> = {
  yellow: "text-yellow-500",
  red: "text-red-500",
  green: "text-green-500",
};

const ClassDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Subjects");
  const [reportQuery, setReportQuery] = useState("");
  const [subjectQuery, setSubjectQuery] = useState("");
  const [subjectPageSize, setSubjectPageSize] = useState(4);
  const [subjectPage, setSubjectPage] = useState(1);
  const [studentQuery, setStudentQuery] = useState("");
  const [studentPageSize, setStudentPageSize] = useState(4);
  const [studentPage, setStudentPage] = useState(1);

  const classNameParam = params.get("name");
  const classDetail = useMemo(
    () => getClassDetailByName(classNameParam),
    [classNameParam],
  );

  const capacityLabel =
    classDetail.capacity === null ? "Undefined" : classDetail.capacity.toString();

  const filteredReports = useMemo(() => {
    const normalized = reportQuery.trim().toLowerCase();
    if (!normalized) {
      return classDetail.reportFormats;
    }
    return classDetail.reportFormats.filter((item) =>
      item.title.toLowerCase().includes(normalized),
    );
  }, [classDetail, reportQuery]);

  const filteredSubjects = useMemo(() => {
    const normalized = subjectQuery.trim().toLowerCase();
    if (!normalized) {
      return classDetail.subjects;
    }
    return classDetail.subjects.filter((subject) => {
      const haystack = `${subject.code} ${subject.name} ${subject.description}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [classDetail, subjectQuery]);

  const filteredStudents = useMemo(() => {
    const normalized = studentQuery.trim().toLowerCase();
    if (!normalized) {
      return classDetail.students;
    }
    return classDetail.students.filter((student) => {
      const email = student.email ?? "";
      const haystack = `${student.id} ${student.name} ${email} ${student.currentClass}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [classDetail, studentQuery]);

  const subjectPageCount = Math.max(
    1,
    Math.ceil(filteredSubjects.length / subjectPageSize),
  );

  const studentPageCount = Math.max(
    1,
    Math.ceil(filteredStudents.length / studentPageSize),
  );

  useEffect(() => {
    if (subjectPage > subjectPageCount) {
      setSubjectPage(subjectPageCount);
    }
  }, [subjectPage, subjectPageCount]);

  useEffect(() => {
    if (studentPage > studentPageCount) {
      setStudentPage(studentPageCount);
    }
  }, [studentPage, studentPageCount]);

  const boundedSubjectPage = Math.min(subjectPage, subjectPageCount);
  const subjectOffset = (boundedSubjectPage - 1) * subjectPageSize;
  const visibleSubjects = filteredSubjects.slice(
    subjectOffset,
    subjectOffset + subjectPageSize,
  );
  const isLastSubjectPage = boundedSubjectPage >= subjectPageCount;

  const boundedStudentPage = Math.min(studentPage, studentPageCount);
  const studentOffset = (boundedStudentPage - 1) * studentPageSize;
  const visibleStudents = filteredStudents.slice(
    studentOffset,
    studentOffset + studentPageSize,
  );
  const isLastStudentPage = boundedStudentPage >= studentPageCount;

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
              <span className="font-semibold text-gray-700">Class Detail</span>
            </nav>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#6c2bd9] transition hover:bg-purple-50"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#6c2bd9]">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">
                        Class Detail
                      </h1>
                      <p className="text-sm text-gray-500">{classDetail.name}</p>
                    </div>
                  </div>
                </div>

                <StatusBadge status={classDetail.status} />
              </div>

              <div className="space-y-6 px-6 pb-6 pt-5">
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="min-w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <th className="w-1/3 bg-[#f8f8ff] px-4 py-3 text-left font-semibold text-[#5b21b6]">
                          Class Name
                        </th>
                        <td className="px-4 py-3 text-gray-800">{classDetail.name}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <th className="w-1/3 bg-[#f8f8ff] px-4 py-3 text-left font-semibold text-[#5b21b6]">
                          Homeroom Teacher
                        </th>
                        <td className="px-4 py-3 text-gray-800">
                          {classDetail.homeroomTeacher}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <th className="w-1/3 bg-[#f8f8ff] px-4 py-3 text-left font-semibold text-[#5b21b6]">
                          Class Capacity
                        </th>
                        <td className="px-4 py-3 text-gray-800">{capacityLabel}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <th className="w-1/3 bg-[#f8f8ff] px-4 py-3 text-left font-semibold text-[#5b21b6]">
                          Total Subjects
                        </th>
                        <td className="px-4 py-3 text-gray-800">
                          {classDetail.totalSubjects}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-1/3 bg-[#f8f8ff] px-4 py-3 text-left font-semibold text-[#5b21b6]">
                          Total Students
                        </th>
                        <td className="px-4 py-3 text-gray-800">
                          {classDetail.totalStudents}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Data
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-200"
                  >
                    <PenSquare className="h-4 w-4" />
                    Edit Data
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-6 space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="flex flex-wrap gap-4 border-b border-gray-100 px-6 pt-4">
                  {tabs.map((tab) => {
                    const active = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`relative pb-3 text-sm font-semibold transition ${
                          active
                            ? "text-[#5b21b6]"
                            : "text-gray-500 hover:text-[#6c2bd9]"
                        }`}
                      >
                        {tab}
                        {active && (
                          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#5b21b6]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-4 px-6 pb-6 pt-5">
                  {activeTab === "Subjects" && (
                    <div className="space-y-5">
                      <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Subjects List
                        </h2>
                        <label className="relative block w-full max-w-md">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="h-4 w-4" />
                          </span>
                          <input
                            type="search"
                            value={subjectQuery}
                            onChange={(event) => {
                              setSubjectQuery(event.target.value);
                              setSubjectPage(1);
                            }}
                            placeholder="Search Here"
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                          />
                        </label>
                      </div>

                      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                          <thead className="bg-[#f8f8ff] text-[#5b21b6]">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">
                                Subject Code
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                Subject Name
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                            {visibleSubjects.map((subject) => (
                              <tr key={subject.code} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                  {subject.code}
                                </td>
                                <td className="px-4 py-3">{subject.name}</td>
                                <td className="px-4 py-3 text-gray-500">
                                  {subject.description}
                                </td>
                              </tr>
                            ))}
                            {visibleSubjects.length === 0 && (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="py-12 text-center text-sm text-gray-500"
                                >
                                  No subjects match your search.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        <div className="flex flex-col gap-3 border-t border-gray-100 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span>Showing</span>
                            <select
                              value={subjectPageSize}
                              onChange={(event) => {
                                setSubjectPageSize(Number(event.target.value));
                                setSubjectPage(1);
                              }}
                              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                            >
                              {[4, 10, 25].map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <span>from {filteredSubjects.length} data</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Pagination
                              page={boundedSubjectPage}
                              pageCount={subjectPageCount}
                              onPageChange={setSubjectPage}
                            />
                            <button
                              type="button"
                              onClick={() => setSubjectPage(subjectPageCount)}
                              disabled={isLastSubjectPage}
                              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-[#6c2bd9] transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-400"
                            >
                              Go {">>"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Students" && (
                    <div className="space-y-5">
                      <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Students List
                        </h2>
                        <label className="relative block w-full max-w-md">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="h-4 w-4" />
                          </span>
                          <input
                            type="search"
                            value={studentQuery}
                            onChange={(event) => {
                              setStudentQuery(event.target.value);
                              setStudentPage(1);
                            }}
                            placeholder="Search Here"
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                          />
                        </label>
                      </div>

                      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                          <thead className="bg-[#f8f8ff] text-[#5b21b6]">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">
                                <span className="inline-flex items-center gap-2">
                                  Student ID
                                  <ArrowUpDown className="h-3.5 w-3.5" />
                                </span>
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                <span className="inline-flex items-center gap-2">
                                  Student Name
                                  <ArrowUpDown className="h-3.5 w-3.5" />
                                </span>
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                <span className="inline-flex items-center gap-2">
                                  Student Email
                                  <ArrowUpDown className="h-3.5 w-3.5" />
                                </span>
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                <span className="inline-flex items-center gap-2">
                                  Current Class
                                  <ArrowUpDown className="h-3.5 w-3.5" />
                                </span>
                              </th>
                              <th className="px-4 py-3 text-left font-semibold">
                                <span className="inline-flex items-center gap-2">
                                  Current Flag
                                  <ArrowUpDown className="h-3.5 w-3.5" />
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                            {visibleStudents.map((student) => {
                              const emailLabel = student.email?.trim() ? student.email : "-";
                              return (
                                <tr key={student.id} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 font-medium text-gray-900">
                                    {student.id}
                                  </td>
                                  <td className="px-4 py-3">{student.name}</td>
                                  <td className="px-4 py-3 text-gray-500">
                                    {emailLabel}
                                  </td>
                                  <td className="px-4 py-3">{student.currentClass}</td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-2">
                                      <Flag
                                        className={`h-4 w-4 ${flagColorMap[student.flag]}`}
                                        aria-hidden="true"
                                      />
                                      <span className="sr-only">{student.flag} flag</span>
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                            {visibleStudents.length === 0 && (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="py-12 text-center text-sm text-gray-500"
                                >
                                  No students match your search.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        <div className="flex flex-col gap-3 border-t border-gray-100 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span>Showing</span>
                            <select
                              value={studentPageSize}
                              onChange={(event) => {
                                setStudentPageSize(Number(event.target.value));
                                setStudentPage(1);
                              }}
                              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                            >
                              {[4, 10, 25].map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <span>from {filteredStudents.length} data</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Pagination
                              page={boundedStudentPage}
                              pageCount={studentPageCount}
                              onPageChange={setStudentPage}
                            />
                            <button
                              type="button"
                              onClick={() => setStudentPage(studentPageCount)}
                              disabled={isLastStudentPage}
                              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-[#6c2bd9] transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-400"
                            >
                              Go {">>"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Student Report Format" && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Student Report Format Used
                        </h2>
                        <label className="relative block w-full max-w-md">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <ClipboardList className="h-4 w-4" />
                          </span>
                          <input
                            type="search"
                            value={reportQuery}
                            onChange={(event) => setReportQuery(event.target.value)}
                            placeholder="Search Here"
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                          />
                        </label>
                      </div>

                      <div className="space-y-3">
                        {filteredReports.map((report) => (
                          <div
                            key={report.id}
                            className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                          >
                            <button
                              type="button"
                              className="text-left text-base font-semibold text-[#5b21b6] transition hover:underline"
                            >
                              {report.title}
                            </button>
                            <p className="text-sm text-gray-500">
                              Created at : {report.createdAt}
                            </p>
                          </div>
                        ))}
                        {filteredReports.length === 0 && (
                          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                            No report formats match your search.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
