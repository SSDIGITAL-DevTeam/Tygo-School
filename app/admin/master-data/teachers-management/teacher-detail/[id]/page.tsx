"use client";

import React, { useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../../components/admin/Sidebar";
import Header from "../../../../../../components/layout-global/Header";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { formatTeacherPhone, getTeacherById } from "../../teacher-data";
import DeleteButton from "@/components/layout-global/DeleteButton";
import EditButton from "@/components/layout-global/EditButton";
import DeleteModal from "@/components/admin/modal/DeleteModal"; // <-- sesuaikan bila perlu

const inter = Inter({ subsets: ["latin"] });

// Halaman list (tujuan setelah delete)
const TEACHER_LIST_PATH =
  "/admin/master-data/teachers-management";

type Status = "Active" | "Non Active";

const statusBadgeClass = (status: Status) =>
  status === "Active"
    ? "inline-flex items-center rounded-md bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
    : "inline-flex items-center rounded-md bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20";

const TeacherDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const teacherId = useMemo(
    () => decodeURIComponent(String(params?.id ?? "")),
    [params]
  );
  const teacher = useMemo(() => getTeacherById(teacherId), [teacherId]);

  const [confirmOpen, setConfirmOpen] = useState(false);
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
            <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
            <main className="relative z-0 ml-64 p-4 md:p-6 lg:p-8">
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">
                  Teacher Not Found
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  We couldn't locate the requested teacher. Please return to the
                  teacher list.
                </p>
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

  const { fullName, email, homeroomClass, status, id, subjects } = teacher;
  const phone = formatTeacherPhone(teacher);

  const breadcrumb = (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
      <ol className="flex items-center gap-2">
        <li>Master Data</li>
        <li aria-hidden className="text-gray-400">/</li>
        <li>Manage Teachers</li>
        <li aria-hidden className="text-gray-400">/</li>
        <li className="font-medium text-gray-900">Teacher Detail</li>
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
          <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
          <main className="relative z-0 ml-64 space-y-6 p-4 md:p-6 lg:p-8">
            {breadcrumb}

            <section className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
                    <h1 className="text-xl font-semibold text-gray-900">
                      Teacher Detail
                    </h1>
                    <p className="text-sm text-gray-500">{fullName}</p>
                  </div>
                </div>
              </div>
              <span className={statusBadgeClass(status)}>{status}</span>
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="grid grid-cols-1 border-b border-gray-200 text-sm font-semibold text-[#6c2bd9] md:grid-cols-3">
                <div className="px-5 py-3">Teacher ID</div>
                <div className="px-5 py-3">Full Name</div>
                <div className="px-5 py-3">Email</div>
              </div>
              <div className="grid grid-cols-1 divide-y divide-gray-200 text-sm text-gray-800 md:grid-cols-3 md:divide-x md:divide-y-0">
                <div className="px-5 py-3">{id}</div>
                <div className="px-5 py-3">{fullName}</div>
                <div className="px-5 py-3">{email}</div>
              </div>
              <div className="grid grid-cols-1 border-y border-gray-200 text-sm font-semibold text-[#6c2bd9] md:grid-cols-2">
                <div className="px-5 py-3">Homeroom Class</div>
                <div className="px-5 py-3">Phone Number</div>
              </div>
              <div className="grid grid-cols-1 divide-y divide-gray-200 text-sm text-gray-800 md:grid-cols-2 md:divide-x md:divide-y-0">
                <div className="px-5 py-3">{homeroomClass ?? "--"}</div>
                <div className="px-5 py-3">{phone}</div>
              </div>
              <div className="border-t border-gray-200 px-5 py-3 text-sm font-semibold text-[#6c2bd9]">
                Subject Specialization
              </div>
              <div className="bg-gray-50 px-5 py-4">
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-800">
                  {subjects.map((subject) => (
                    <li key={subject}>{subject}</li>
                  ))}
                </ul>
              </div>
            </section>

            <div className="flex justify-end gap-3">
              <DeleteButton onClick={() => setConfirmOpen(true)} label="Delete Data" />
              <EditButton
                onClick={() =>
                  router.push(
                    `/admin/master-data/teachers-management/teacher-detail/${encodeURIComponent(
                      id
                    )}/edit`
                  )
                }
                label="Edit Data"
              />
            </div>
          </main>
        </div>
      </div>

      {/* Modal Delete */}
      <DeleteModal
        open={confirmOpen}
        name={fullName || id}
        msg="teacher"
        onConfirm={() => {
          setConfirmOpen(false);
          // TODO: hapus data di storage/API kalau sudah ada
          router.push(TEACHER_LIST_PATH);
        }}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default TeacherDetailPage;