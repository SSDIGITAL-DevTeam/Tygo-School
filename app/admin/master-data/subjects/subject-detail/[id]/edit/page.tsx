"use client";

import React, { useState, useCallback } from "react";
import { Inter } from "next/font/google";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../../../../../../components/admin/Sidebar";
import Header from "../../../../../../../components/layout-global/Header";
import ToggleSwitch from "../../../../../../../components/layout-global/ToggleSwitch";
import SaveChangesModal from "../../../../../../../components/admin/modal/EditModal";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getSubjectList, SubjectRecord } from "../../../subject-data";
import SaveButton from "@/components/layout-global/SaveButton";

const inter = Inter({ subsets: ["latin"] });

const EditSubjectPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.id as string;

  // Get subject data based on ID (using code as ID)
  const subjects = getSubjectList();
  const originalSubject = subjects.find((item) => item.code === subjectId) ?? subjects[0];

  // Form state
  const [formData, setFormData] = useState<SubjectRecord>({
    code: originalSubject.code,
    name: originalSubject.name,
    description: originalSubject.description,
    status: originalSubject.status,
  });

  // Modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle form changes
  const handleInputChange = useCallback((field: keyof SubjectRecord, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleStatusChange = useCallback((isActive: boolean) => {
    setFormData(prev => ({
      ...prev,
      status: isActive ? "Active" : "Non Active",
    }));
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    setShowSaveModal(true);
  }, []);

  const handleConfirmSave = useCallback(() => {
    // Here you would typically save the data to your backend
    console.log("Saving subject data:", formData);
    setShowSaveModal(false);
    router.push(`/admin/master-data/subjects/subject-detail?code=${formData.code}`);
  }, [formData, router]);

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <main className="md:ml-64 p-4 md:p-6 lg:p-8">
            {/* Breadcrumb */}
            <nav className="mb-5 text-sm text-gray-500" aria-label="Breadcrumb">
              <span className="text-gray-400">Master Data</span>
              <span className="mx-2">/</span>
              <span className="text-gray-500">Manage Subjects</span>
              <span className="mx-2">/</span>
              <span className="text-gray-500">Subject Detail</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">Edit Subject</span>
            </nav>

            {/* Main Content Card */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Header Section */}
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
                      <h1 className="text-xl font-semibold text-gray-900">Edit Subject</h1>
                      <p className="text-sm text-gray-500">{formData.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    formData.status === "Active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {formData.status}
                  </span>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-6 px-6 pb-6 pt-5">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Subject Code */}
                  <div>
                    <label htmlFor="subject-code" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Code
                    </label>
                    <input
                      id="subject-code"
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                      placeholder="Enter subject code"
                    />
                  </div>

                  {/* Subject Name */}
                  <div>
                    <label htmlFor="subject-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Name
                    </label>
                    <input
                      id="subject-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                      placeholder="Enter subject name"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                    placeholder="Enter description"
                  />
                </div>

                {/* Status Toggle */}
                <div>
                  <ToggleSwitch
                    id="status-toggle"
                    label="Status"
                    checked={formData.status === "Active"}
                    onChange={handleStatusChange}
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <SaveButton
                    onClick={handleSave}
                  />
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Save Confirmation Modal */}
      <SaveChangesModal
        open={showSaveModal}
        msg="this subject"
        onConfirm={handleConfirmSave}
        onClose={() => setShowSaveModal(false)}
      />
    </div>
  );
};

export default EditSubjectPage;