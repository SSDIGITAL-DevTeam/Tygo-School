"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";

import StatusBadge from "@/components/layout-global/StatusBadge";
import DeleteButton from "@/components/layout-global/DeleteButton";
import EditButton from "@/components/layout-global/EditButton";
import DeleteModal from "@/components/admin/modal/DeleteModal";

import { ArrowLeft, BookOpen, Shapes, Trash2, PenSquare } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

type Category = {
  id: string;
  name: string;
  type: string;
  relatedTo: string;
  status: "Active" | "Non Active";
};

const CATEGORIES: Category[] = [
  { id: "uas", name: "UAS", type: "Quantitative (Number)", relatedTo: "Subject", status: "Active" },
  { id: "uts", name: "UTS", type: "Quantitative (Number)", relatedTo: "Subject", status: "Active" },
  { id: "tasks", name: "Average Daily Tasks", type: "Quantitative (Number)", relatedTo: "Subject", status: "Active" },
  { id: "honesty", name: "Honesty", type: "Qualitative (Text)", relatedTo: "Personal Assessment", status: "Active" },
  { id: "attitude", name: "Attitude", type: "Qualitative (Text)", relatedTo: "Personal Assessment", status: "Active" },
];

const LIST_PATH = "/admin/master-data/student-report/assessment-category";

export default function AssessmentCategoryDetailPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const id = params.get("id") ?? "";
  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0],
    [id]
  );

  const onDelete = () => setShowDeleteModal(true);
  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    router.push(LIST_PATH);
  };

  useEffect(() => {
  if (!showDeleteModal) return;
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = prev;
  };
}, [showDeleteModal]);

  return (
    <div className="px-0">
      <div className={`min-h-screen bg-[#f5f6fa] p-4 md:p-6 lg:p-8 ${inter.className}`}>
        {/* Strip judul + tabs */}
        <div className="-mx-6 -mt-1 border-b border-gray-100 bg-[#f3f4f6] px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center text-gray-800">
              <Shapes className="h-5 w-5" />
            </div>
            {/* If this is a detail page, set title to: Assessment Category Detail (UAS) */}
            <h2 className="text-base font-semibold text-gray-900">
              Add Assessment Category
            </h2>
          </div>
        </div>

        {/* Tombol back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-3 inline-flex items-center gap-2 px-1 text-sm font-semibold text-[#6c2bd9] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Detail card */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 px-6 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Assessment Category Detail ({category.name})
            </h3>
          </div>

          <div className="px-6 pb-6 pt-4">
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full text-sm">
                <tbody>
                  <tr className="bg-[#f8f8ff] font-semibold text-[#5b21b6]">
                    <td className="w-1/3 px-6 py-3">Category Name</td>
                    <td className="w-1/3 px-6 py-3">Assessment Type</td>
                    <td className="w-1/3 px-6 py-3">Related To</td>
                  </tr>
                  <tr className="border-t border-gray-200 text-gray-900">
                    <td className="px-6 py-3">{category.name}</td>
                    <td className="px-6 py-3">{category.type}</td>
                    <td className="px-6 py-3">{category.relatedTo}</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-6 py-3 font-semibold text-[#6c2bd9]">Status</td>
                    <td className="px-6 py-3" colSpan={2}>
                      <StatusBadge status={category.status} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <DeleteButton
                onClick={onDelete}

              />
              <EditButton
                onClick={() =>
                  router.push(
                    `/admin/master-data/student-report/assessment-category/${category.id}/edit`
                  )
                }

              />
            </div>
          </div>
        </section>
        </div>

        {/* Modal konfirmasi delete */}
        <DeleteModal
          open={showDeleteModal}
          name={category.name}
          msg="assessment category"
          onConfirm={onConfirmDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      
    </div>
  );
}