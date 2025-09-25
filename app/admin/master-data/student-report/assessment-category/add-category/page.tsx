"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Shapes } from "lucide-react";

type FormState = {
  categoryName: string;
  assessmentType: string;
  relatedTo: string;
};

const initialState: FormState = {
  categoryName: "",
  assessmentType: "",
  relatedTo: "",
};

const assessmentTypeOptions = ["Quantitative (Number)", "Qualitative (Text)"];
const relatedToOptions = ["Subject", "Personal Assessment", "Extracurricular"];

const AddCategoryPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const router = useRouter();

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Saving category:", form);
    alert("Assessment category has been saved successfully!");
    router.back();
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
    <div className="px-0">
      {/* SECTION HEADER STRIP (full-bleed within the white wrapper) */}
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

      {/* BACK LINK (left-aligned, purple) */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mt-3 inline-flex items-center gap-2 px-1 text-sm font-semibold text-[#6c2bd9] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* FORM CARD */}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mx-auto w-full max-w-[860px]">
            <FormRow
              label="Category Name"
              required
              input={
                <input
                  type="text"
                  placeholder="Enter Class Name"
                  value={form.categoryName}
                  onChange={handleChange("categoryName")}
                  className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                  required
                />
              }
            />

            <FormRow
              label="Assessment Type"
              required
              input={
                <select
                  value={form.assessmentType}
                  onChange={handleChange("assessmentType")}
                  className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                  required
                >
                  <option value="" disabled>
                    Select Assessment Type
                  </option>
                  {assessmentTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              }
            />

            <FormRow
              label="Related To"
              required
              input={
                <select
                  value={form.relatedTo}
                  onChange={handleChange("relatedTo")}
                  className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#6c2bd9] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]/30"
                  required
                >
                  <option value="" disabled>
                    Select Assessment Relation
                  </option>
                  {relatedToOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              }
            />

            {/* ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="hidden md:block" />
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#6c2bd9] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#5922b8]"
                >
                  <Save className="h-4 w-4" />
                  Save Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryPage;