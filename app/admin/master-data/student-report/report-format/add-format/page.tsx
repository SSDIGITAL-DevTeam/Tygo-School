"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddAssessmentGroupModal from "../../../../../../components/modal/AddAssessmentGroupModal";
import { ArrowLeft, Plus, Save } from "lucide-react";

type FormState = {
  reportFormatName: string;
  academicYear: string;
  semester: string;
  additionalNotes: boolean;
};

const initialState: FormState = {
  reportFormatName: "",
  academicYear: "",
  semester: "",
  additionalNotes: true,
};

const semesterOptions = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
];

const AddReportFormatPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [assessmentGroups, setAssessmentGroups] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleToggleChange = (field: keyof FormState) => (checked: boolean) => {
    setForm((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Saving report format:", form);
    console.log("Assessment groups:", assessmentGroups);
    alert("Report format has been saved successfully!");
    router.back();
  };

  const addAssessmentGroup = (groupType: string) => {
    setAssessmentGroups((prev) => [...prev, groupType]);
    setModalOpen(false);
  };

  const FormRow: React.FC<{
    label: string;
    required?: boolean;
    input: React.ReactNode;
  }> = ({ label, required, input }) => (
    <div className="grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[220px_minmax(0,1fr)]">
      <label className="flex items-center justify-end pr-3 text-sm font-medium text-gray-700">
        <span className="text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
        <span className="ml-1 text-gray-400">:</span>
      </label>
      <div className="min-w-0">{input}</div>
    </div>
  );

  return (
    <>
      {/* TOP STRIP: Back + Title (left) and Save button (right) */}
      <div className="-mx-6 -mt-1 mb-4 flex items-center justify-between border-b border-gray-100 bg-[#f3f4f6] px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6c2bd9] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h2 className="text-base font-semibold text-gray-900">
            Add Report Format
          </h2>
        </div>

        <button
          type="submit"
          form="report-format-form"
          className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#5922b8]"
        >
          <Save className="h-4 w-4" />
          Save Data
        </button>
      </div>

      {/* FORM */}
      <form id="report-format-form" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* GENERAL INFORMATION */}
          <h3 className="mb-6 text-center text-lg font-semibold text-gray-900">
            General Information
          </h3>

          <div className="mx-auto w-full max-w-[900px]">
            <FormRow
              label="Report Format Name"
              required
              input={
                <input
                  type="text"
                  placeholder="Enter Report Format Name"
                  value={form.reportFormatName}
                  onChange={handleChange("reportFormatName")}
                  className="w-full max-w-[640px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                  required
                />
              }
            />

            <FormRow
              label="Academic Year"
              required
              input={
                <input
                  type="text"
                  placeholder="Enter Academic Year"
                  value={form.academicYear}
                  onChange={handleChange("academicYear")}
                  className="w-full max-w-[640px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                  required
                />
              }
            />

            <FormRow
              label="Semester"
              required
              input={
                <select
                  value={form.semester}
                  onChange={handleChange("semester")}
                  className="w-full max-w-[640px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                  required
                >
                  <option value="" disabled>
                    Select Semester Type
                  </option>
                  {semesterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              }
            />

            <FormRow
              label="Additional Notes"
              input={
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleChange("additionalNotes")(!form.additionalNotes)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6c2bd9] focus:ring-offset-2 ${
                      form.additionalNotes ? "bg-[#6c2bd9]" : "bg-gray-200"
                    }`}
                    aria-pressed={form.additionalNotes}
                    aria-label="Toggle additional notes"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        form.additionalNotes ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm ${
                      form.additionalNotes ? "text-[#6c2bd9]" : "text-gray-600"
                    }`}
                  >
                    {form.additionalNotes ? "True" : "False"}
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </form>

      {/* ASSESSMENT GROUP SECTION HEADER (grey strip like the mock) */}
      <div className="-mx-6 mt-6 border-y border-gray-100 bg-[#f3f4f6] px-6 py-3">
        <h3 className="text-lg font-semibold text-gray-900">Assessment Group</h3>
      </div>

      {/* ASSESSMENT GROUP CONTENT */}
      <div className="mt-4">
        <div className="mx-auto w-full max-w-[900px]">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#6c2bd9] bg-[#f8f4ff] px-4 py-6 text-sm font-medium text-[#6c2bd9] transition hover:bg-[#f3e8ff]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6c2bd9] text-white">
              <Plus className="h-4 w-4" />
            </span>
            Add Assessment Group
          </button>

          {/* Render added groups */}
          {assessmentGroups.length > 0 && (
            <div className="mt-4 space-y-2">
              {assessmentGroups.map((group, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                >
                  <span className="text-sm text-gray-700">{group}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAssessmentGroups((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddAssessmentGroupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={addAssessmentGroup}
      />
    </>
  );
};

export default AddReportFormatPage;