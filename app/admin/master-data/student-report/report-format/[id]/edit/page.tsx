"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { useRouter, useParams } from "next/navigation";

import EditButton from "@/components/layout-global/EditButton";
import EditModal from "@/components/admin/modal/EditModal";
import DeleteModal from "@/components/admin/modal/DeleteModal";
import ToggleSwitch from "@/components/layout-global/ToggleSwitch";

import { ArrowLeft, BookOpen, Plus, X } from "lucide-react";
import DeleteButton from "@/components/layout-global/DeleteButton";

const inter = Inter({ subsets: ["latin"] });

type AssessmentGroup = {
  id: string;
  name: string;
  relatedTo: string;
  categories: string[];
};

type ReportFormat = {
  id: string;
  name: string;
  academicYear: string;
  semester: string;
  additionalNotes: boolean;
  status: "Active" | "Non Active";
  assessmentGroups: AssessmentGroup[];
};

const REPORT_FORMATS: ReportFormat[] = [
  {
    id: "even-2024",
    name: "Even Semester Report 2024/25",
    academicYear: "2024/25",
    semester: "Even",
    additionalNotes: true,
    status: "Active",
    assessmentGroups: [
      {
        id: "grades",
        name: "Even Semester Grades",
        relatedTo: "Subjects",
        categories: ["UTS", "Average Daily Tasks", "UAS"]
      },
      {
        id: "behavior",
        name: "Student Attitude And Behavior",
        relatedTo: "Personal Assessment",
        categories: ["Honesty", "Attitude"]
      }
    ]
  },
  {
    id: "odd-2024",
    name: "Odd Semester Report 2024/25",
    academicYear: "2024/25",
    semester: "Odd",
    additionalNotes: false,
    status: "Active",
    assessmentGroups: [
      {
        id: "grades-odd",
        name: "Odd Semester Grades",
        relatedTo: "Subjects",
        categories: ["UTS", "UAS"]
      }
    ]
  }
];

const LIST_PATH = "/admin/master-data/student-report/report-format";

export default function ReportFormatEditPage() {
  const router = useRouter();
  const params = useParams();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
    semester: "Even",
    additionalNotes: false,
    status: true,
    assessmentGroups: [] as AssessmentGroup[]
  });

  const formatId = useMemo(
    () => decodeURIComponent(String(params?.id ?? "")),
    [params]
  );

  const reportFormat = useMemo(
    () => REPORT_FORMATS.find((r) => r.id === formatId) ?? null,
    [formatId]
  );

  useEffect(() => {
    if (reportFormat) {
      setFormData({
        name: reportFormat.name,
        academicYear: reportFormat.academicYear,
        semester: reportFormat.semester,
        additionalNotes: reportFormat.additionalNotes,
        status: reportFormat.status === "Active",
        assessmentGroups: reportFormat.assessmentGroups
      });
    }
  }, [reportFormat]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setShowEditModal(true);
  };

  const handleConfirmSave = () => {
    console.log("Saving report format data:", {
      id: formatId,
      ...formData,
      status: formData.status ? "Active" : "Non Active"
    });
    
    setShowEditModal(false);
    router.push(LIST_PATH);
  };

  const handleClearForm = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmClear = () => {
    if (reportFormat) {
      setFormData({
        name: reportFormat.name,
        academicYear: reportFormat.academicYear,
        semester: reportFormat.semester,
        additionalNotes: reportFormat.additionalNotes,
        status: reportFormat.status === "Active",
        assessmentGroups: reportFormat.assessmentGroups
      });
    }
    setShowDeleteModal(false);
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!showEditModal && !showDeleteModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showEditModal, showDeleteModal]);

  // Show error if report format not found
  if (!reportFormat) {
    return (
      <div className={`min-h-screen bg-[#f5f6fa] p-4 md:p-6 lg:p-8 ${inter.className}`}>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Report Format Not Found
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            The requested report format could not be found. Please return to the format list.
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

        {/* Content Area */}
        <div className="bg-[#f7f8fb] px-6 pb-6 pt-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-1 text-sm font-semibold text-[#6c2bd9] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Report Format ({reportFormat.name})
              </h2>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3">
              <DeleteButton  onClick={handleClearForm} />

              <EditButton
                label="Save Data"
                onClick={handleSave}
              />
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {/* General Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                General Information
              </h3>
              
              <div className="space-y-6">
                {/* Report Format Name */}
                <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3 items-center">
                  <label htmlFor="formatName" className="text-sm font-medium text-gray-700">
                    Report Format Name :
                  </label>
                  <input
                    id="formatName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                    required
                  />
                </div>

                {/* Academic Year */}
                <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3 items-center">
                  <label htmlFor="academicYear" className="text-sm font-medium text-gray-700">
                    Academic Year :
                  </label>
                  <input
                    id="academicYear"
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => handleInputChange("academicYear", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                    required
                  />
                </div>

                {/* Semester */}
                <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3 items-center">
                  <label htmlFor="semester" className="text-sm font-medium text-gray-700">
                    Semester :
                  </label>
                  <select
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => handleInputChange("semester", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                    required
                  >
                    <option value="Even">Even</option>
                    <option value="Odd">Odd</option>
                  </select>
                </div>

                {/* Additional Notes */}
                <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Additional Notes :
                  </label>
                  <ToggleSwitch
                    id="additional-notes"
                    label=""
                    checked={formData.additionalNotes}
                    onChange={(checked) => handleInputChange("additionalNotes", checked)}
                    className="[&_label]:hidden"
                  />
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Status :
                  </label>
                  <ToggleSwitch
                    id="status"
                    label=""
                    checked={formData.status}
                    onChange={(checked) => handleInputChange("status", checked)}
                    className="[&_label]:hidden"
                  />
                </div>
              </div>
            </div>

            {/* Assessment Groups */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Assessment Group
              </h3>

              {formData.assessmentGroups.map((group, index) => (
                <div key={group.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="space-y-6">
                    {/* Assessment Group Name */}
                    <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3 items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Assessment Group Name :
                      </label>
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) => {
                          const newGroups = [...formData.assessmentGroups];
                          newGroups[index] = { ...group, name: e.target.value };
                          handleInputChange("assessmentGroups", newGroups);
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                      />
                    </div>

                    {/* Related To */}
                    <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3 items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Related To :
                      </label>
                      <select
                        value={group.relatedTo}
                        onChange={(e) => {
                          const newGroups = [...formData.assessmentGroups];
                          newGroups[index] = { ...group, relatedTo: e.target.value };
                          handleInputChange("assessmentGroups", newGroups);
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/20"
                      >
                        <option value="Subjects">Subjects</option>
                        <option value="Personal Assessment">Personal Assessment</option>
                      </select>
                    </div>

                    {/* Assessment Category */}
                    <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-3 items-start">
                      <label className="text-sm font-medium text-gray-700 pt-2">
                        Assessment Category :
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {group.categories.map((category, catIndex) => (
                          <span
                            key={catIndex}
                            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => {
                                const newGroups = [...formData.assessmentGroups];
                                newGroups[index] = {
                                  ...group,
                                  categories: group.categories.filter((_, i) => i !== catIndex)
                                };
                                handleInputChange("assessmentGroups", newGroups);
                              }}
                            >
                              <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                            </button>
                          </span>
                        ))}
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-500 hover:bg-gray-50"
                        >
                          Select Category
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#6c2bd9] text-[#6c2bd9] hover:bg-purple-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Assessment Group Button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const newGroups = formData.assessmentGroups.filter((_, i) => i !== index);
                        handleInputChange("assessmentGroups", newGroups);
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                      Delete Assessment Group
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Assessment Group Button */}
              <button
                type="button"
                onClick={() => {
                  const newGroup: AssessmentGroup = {
                    id: `new-group-${Date.now()}`,
                    name: "",
                    relatedTo: "Subjects",
                    categories: []
                  };
                  handleInputChange("assessmentGroups", [...formData.assessmentGroups, newGroup]);
                }}
                className="w-full rounded-xl border-2 border-dashed border-[#6c2bd9] bg-purple-50 py-4 text-center text-[#6c2bd9] hover:bg-purple-100"
              >
                <div className="flex items-center justify-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Add Assessment Group</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      

      {/* Edit Modal */}
      <EditModal
        open={showEditModal}
        msg="report format"
        onConfirm={handleConfirmSave}
        onClose={() => setShowEditModal(false)}
      />

      {/* Delete Modal for Clear Form */}
      <DeleteModal
        open={showDeleteModal}
        name={formData.name}
        msg="format"
        onConfirm={handleConfirmClear}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}