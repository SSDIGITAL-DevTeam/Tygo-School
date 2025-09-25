"use client";

import React from "react";
import { Inter } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../../../../components/admin/Sidebar";
import Header from "../../../../../components/layout-global/Header";
import StatusBadge from "../../../../../components/layout-global/StatusBadge";
import { ArrowLeft, BookOpen, PenSquare, Trash2 } from "lucide-react";
import { getSubjectList } from "../subject-data";

const inter = Inter({ subsets: ["latin"] });

const SubjectDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();

  const subjectCode = params.get("code");
  const subjects = getSubjectList();
  const subject =
    subjects.find((item) => item.code === subjectCode) ?? subjects[0];

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar
          isOpen={false}
          onClose={() => undefined}
          active="Master Data"
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header onToggleSidebar={() => undefined} />

          <main className="md:ml-64 p-4 md:p-6 lg:p-8">
            <nav className="mb-5 text-sm text-gray-500" aria-label="Breadcrumb">
              <span className="text-gray-400">Master Data</span>
              <span className="mx-2">/</span>
              <span className="text-gray-500">Manage Subjects</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">
                Subject Detail
              </span>
            </nav>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-6">
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
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">
                        Subject Detail
                      </h1>
                      <p className="text-sm text-gray-500">
                        {subject?.name ?? ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <StatusBadge status={subject?.status ?? "Active"} />
                </div>
              </div>

              <div className="space-y-6 px-6 pb-6 pt-5">
                <div className="rounded-md border-2 border-[#3b82f6]">
                  <table className="min-w-full text-sm">
                    <tbody>
                      {/* Header row (judul kolom) */}
                      <tr className="border-b border-blue-300 border-dotted">
                        <th className="w-1/2 bg-[#f8f8ff] px-6 py-3 text-left font-semibold text-[#5b21b6]">
                          Subject Code
                        </th>
                        <th className="w-1/2 bg-[#f8f8ff] px-6 py-3 text-left font-semibold text-[#5b21b6] border-l border-gray-200">
                          Subject Name
                        </th>
                      </tr>

                      {/* Value row */}
                      <tr className="border-b border-blue-300 border-dotted">
                        <td className="px-6 py-3 text-gray-800">
                          {subject?.code ?? "-"}
                        </td>
                        <td className="px-6 py-3 text-gray-800 border-l border-gray-200">
                          {subject?.name ?? "-"}
                        </td>
                      </tr>

                      {/* Description row (span sisa kolom) */}
                      <tr className="border-b border-blue-300 border-dotted last:border-b-0">
                        <th className="bg-[#f8f8ff] px-6 py-3 text-left font-semibold text-[#5b21b6] align-top">
                          Description
                        </th>
                        <th className="bg-[#f8f8ff] px-6 py-3 text-left font-semibold text-[#5b21b6] align-top">
                          
                        </th>
                      </tr>

                      <tr className="border-b border-blue-300 border-dotted last:border-b-0">
                        <td className="px-6 py-3 text-gray-800 border-l border-gray-200">
                          {subject?.description ?? "-"}
                        </td>
                        <td className="px-6 py-3 text-gray-600" colSpan={1}>
                          
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Data
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-200"
                  >
                    <PenSquare className="h-4 w-4" />
                    Edit Data
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailPage;
