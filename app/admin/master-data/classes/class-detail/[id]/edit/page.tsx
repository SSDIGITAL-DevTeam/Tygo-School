"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Inter } from "next/font/google";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../../../../../../components/admin/Sidebar";
import Header from "../../../../../../../components/layout-global/Header";
import ToggleSwitch from "../../../../../../../components/layout-global/ToggleSwitch";
import SaveChangesModal from "../../../../../../../components/admin/modal/EditModal";
import { ArrowLeft, GraduationCap, Plus, X } from "lucide-react";
import { getClassDetailByName, ClassDetailRecord } from "../../../class-data";

const inter = Inter({ subsets: ["latin"] });

const EditClassPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;

  // Get class data and available options
  const originalClass = useMemo(() => getClassDetailByName(classId), [classId]);
  // Mock data since we can't import from other modules
  const teacherOptions = useMemo(() => [
    "Dafa Aulia",
    "Ryan Kusuma", 
    "Heriyanto",
    "Siti Rahma",
    "Adi Nugraha",
    "Laras Wibowo",
    "Nurul Hakim"
  ], []);
  
  const subjectOptions = useMemo(() => [
    "Math 01",
    "English 01", 
    "Biology 01",
    "Chemistry 01",
    "Programming 01",
    "Art 01"
  ], []);
  const reportFormatOptions = useMemo(() => [
    "Odd Semester Report 2024/2025",
    "Even Semester Report 2024/2025", 
    "Mid Term Progress Report 2024/2025",
    "Final Exam Report 2024/2025"
  ], []);

  // Form state
  const [formData, setFormData] = useState<ClassDetailRecord>({
    ...originalClass,
    subjects: [...originalClass.subjects],
    students: [...originalClass.students],
    reportFormats: [...originalClass.reportFormats],
  });

  // Expanded state for form sections
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    originalClass.subjects.map(s => s.name)
  );
  const [selectedReportFormats, setSelectedReportFormats] = useState<string[]>(
    originalClass.reportFormats.map(r => r.title)
  );

  // Modal and UI state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle form changes
  const handleInputChange = useCallback((field: keyof ClassDetailRecord, value: string | number | null) => {
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

  // Handle subject management
  const handleSubjectAdd = useCallback((subject: string) => {
    if (!selectedSubjects.includes(subject)) {
      setSelectedSubjects(prev => [...prev, subject]);
    }
  }, [selectedSubjects]);

  const handleSubjectRemove = useCallback((subject: string) => {
    setSelectedSubjects(prev => prev.filter(s => s !== subject));
  }, []);

  // Handle report format management
  const handleReportFormatAdd = useCallback((format: string) => {
    if (!selectedReportFormats.includes(format)) {
      setSelectedReportFormats(prev => [...prev, format]);
    }
  }, [selectedReportFormats]);

  const handleReportFormatRemove = useCallback((format: string) => {
    setSelectedReportFormats(prev => prev.filter(f => f !== format));
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    setShowSaveModal(true);
  }, []);

  const handleConfirmSave = useCallback(() => {
    // Here you would typically save the data to your backend
    const updatedData = {
      ...formData,
      subjects: selectedSubjects,
      reportFormats: selectedReportFormats,
    };
    console.log("Saving class data:", updatedData);
    setShowSaveModal(false);
    router.push(`/admin/master-data/classes/class-detail?name=${formData.name}`);
  }, [formData, selectedSubjects, selectedReportFormats, router]);

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
              <span className="text-gray-500">Manage Classes</span>
              <span className="mx-2">/</span>
              <span className="text-gray-500">Class Detail</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">Edit Classes</span>
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
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">Edit Classes</h1>
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
                {/* Class Name */}
                <div>
                  <label htmlFor="class-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name
                  </label>
                  <input
                    id="class-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                    placeholder="Enter class name"
                  />
                </div>

                {/* Homeroom Teacher */}
                <div>
                  <label htmlFor="homeroom-teacher" className="block text-sm font-medium text-gray-700 mb-2">
                    Homeroom Teacher
                  </label>
                  <select
                    id="homeroom-teacher"
                    value={formData.homeroomTeacher}
                    onChange={(e) => handleInputChange("homeroomTeacher", e.target.value)}
                    className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                  >
                    <option value="">Select Homeroom Teacher</option>
                    {teacherOptions.map((teacher) => (
                      <option key={teacher} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Capacity */}
                <div>
                  <label htmlFor="class-capacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Class Capacity <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    id="class-capacity"
                    type="number"
                    min="1"
                    value={formData.capacity || ""}
                    onChange={(e) => handleInputChange("capacity", e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                    placeholder="Enter class capacity"
                  />
                </div>

                {/* Subjects */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects
                  </label>
                  <div className="space-y-3">
                    {/* Selected subjects display */}
                    <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-gray-300 rounded-lg bg-gray-50">
                      {selectedSubjects.map((subject) => (
                        <span
                          key={subject}
                          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                        >
                          {subject}
                          <button
                            type="button"
                            onClick={() => handleSubjectRemove(subject)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {selectedSubjects.length === 0 && (
                        <span className="text-gray-400 text-sm">No subjects selected</span>
                      )}
                    </div>
                    
                    {/* Add subject dropdown */}
                    <div className="flex gap-2">
                      <select
                        className="flex-1 max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleSubjectAdd(e.target.value);
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="">Select Subject</option>
                        {subjectOptions
                          .filter(subject => !selectedSubjects.includes(subject))
                          .map((subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#6c2bd9] border border-[#6c2bd9] rounded-lg hover:bg-purple-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Student Report Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Report Format
                  </label>
                  <div className="space-y-3">
                    {/* Selected report formats display */}
                    <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-gray-300 rounded-lg bg-gray-50">
                      {selectedReportFormats.map((format) => (
                        <span
                          key={format}
                          className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                        >
                          {format}
                          <button
                            type="button"
                            onClick={() => handleReportFormatRemove(format)}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {selectedReportFormats.length === 0 && (
                        <span className="text-gray-400 text-sm">No report formats selected</span>
                      )}
                    </div>
                    
                    {/* Add report format dropdown */}
                    <div className="flex gap-2">
                      <select
                        className="flex-1 max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleReportFormatAdd(e.target.value);
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="">Select Report Format</option>
                        {reportFormatOptions
                          .filter(format => !selectedReportFormats.includes(format))
                          .map((format) => (
                            <option key={format} value={format}>
                              {format}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#6c2bd9] border border-[#6c2bd9] rounded-lg hover:bg-purple-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
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
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5a23c7] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                  >
                    💾 Save Data
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Save Confirmation Modal */}
      <SaveChangesModal
        open={showSaveModal}
        msg="this class"
        onConfirm={handleConfirmSave}
        onClose={() => setShowSaveModal(false)}
      />
    </div>
  );
};

export default EditClassPage;