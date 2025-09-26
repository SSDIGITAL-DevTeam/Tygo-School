"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { useRouter, useParams } from "next/navigation";

import EditButton from "@/components/layout-global/EditButton";
import EditModal from "@/components/admin/modal/EditModal";
import ToggleSwitch from "@/components/layout-global/ToggleSwitch";

import { ArrowLeft, PenSquare } from "lucide-react";
import SaveButton from "@/components/layout-global/SaveButton";

const inter = Inter({ subsets: ["latin"] });

type Category = {
  id: string;
  name: string;
  type: string;
  relatedTo: string;
  status: "Active" | "Non Active";
};

const CATEGORIES: Category[] = [
  { id: "uas", name: "UAS", type: "Quantitative", relatedTo: "Student", status: "Active" },
  { id: "uts", name: "UTS", type: "Quantitative", relatedTo: "Student", status: "Active" },
  { id: "tasks", name: "Average Daily Tasks", type: "Quantitative", relatedTo: "Student", status: "Active" },
  { id: "honesty", name: "Honesty", type: "Qualitative", relatedTo: "Student", status: "Active" },
  { id: "attitude", name: "Attitude", type: "Qualitative", relatedTo: "Student", status: "Active" },
];

const LIST_PATH = "/admin/master-data/student-report/assessment-category";

export default function AssessmentCategoryEditPage() {
  const router = useRouter();
  const params = useParams();

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    assessmentType: "Quantitative",
    relatedTo: "Student",
    status: true
  });

  const categoryId = useMemo(
    () => decodeURIComponent(String(params?.id ?? "")),
    [params]
  );

  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === categoryId) ?? null,
    [categoryId]
  );

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.name,
        assessmentType: category.type,
        relatedTo: category.relatedTo,
        status: category.status === "Active"
      });
    }
  }, [category]);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setShowEditModal(true);
  };

  const handleConfirmSave = () => {
    // Here you would typically make an API call to save the data
    console.log("Saving category data:", {
      id: categoryId,
      ...formData,
      status: formData.status ? "Active" : "Non Active"
    });
    
    setShowEditModal(false);
    router.push(LIST_PATH);
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!showEditModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showEditModal]);

  // Show error if category not found
  if (!category) {
    return (
      <div className={`min-h-screen bg-[#f5f6fa] p-4 md:p-6 lg:p-8 ${inter.className}`}>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Assessment Category Not Found
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            The requested assessment category could not be found. Please return to the category list.
          </p>
          <button
            type="button"
            onClick={() => router.push(LIST_PATH)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-5 py-2 text-sm font-semibold text-white hover:bg-[#581c87]"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f5f6fa] p-4 md:p-6 lg:p-8 ${inter.className}`}>
      
        <div className="bg-[#f7f8fb] pb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <PenSquare className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Assessment Category
            </h2>
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-2 px-1 text-sm font-semibold text-[#6c2bd9] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {/* Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="space-y-6">
                {/* Category Name */}
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name :
                  </label>
                  <input
                    id="categoryName"
                    type="text"
                    value={formData.categoryName}
                    onChange={(e) => handleInputChange("categoryName", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                {/* Assessment Type */}
                <div>
                  <label htmlFor="assessmentType" className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Type :
                  </label>
                  <select
                    id="assessmentType"
                    value={formData.assessmentType}
                    onChange={(e) => handleInputChange("assessmentType", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                    required
                  >
                    <option value="Quantitative">Quantitative</option>
                    <option value="Qualitative">Qualitative</option>
                  </select>
                </div>

                {/* Related To */}
                <div>
                  <label htmlFor="relatedTo" className="block text-sm font-medium text-gray-700 mb-2">
                    Related To :
                  </label>
                  <select
                    id="relatedTo"
                    value={formData.relatedTo}
                    onChange={(e) => handleInputChange("relatedTo", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                    required
                  >
                    <option value="Student">Student</option>
                    <option value="Subject">Subject</option>
                    <option value="Personal Assessment">Personal Assessment</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <ToggleSwitch
                    id="status-toggle"
                    label="Status :"
                    checked={formData.status}
                    onChange={(checked) => handleInputChange("status", checked)}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <SaveButton
                  label="Save"
                  type="submit"
                  onClick={handleSave}
                />
              </div>
            </form>
          </div>
        </div>
      

      {/* Edit Modal */}
      <EditModal
        open={showEditModal}
        msg="assessment category"
        onConfirm={handleConfirmSave}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}