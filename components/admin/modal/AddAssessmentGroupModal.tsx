"use client";

import React, { useState } from "react";
import { X, HelpCircle } from "lucide-react";

type AddAssessmentGroupModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (groupType: string) => void;
};

const assessmentOptions = [
  {
    id: "subjects",
    label: "Subjects",
    description: "Good for test grades or assignments",
  },
  {
    id: "personal",
    label: "Personal Assessment",
    description: "Good for assessing student attitudes or behavior",
  },
];

const AddAssessmentGroupModal: React.FC<AddAssessmentGroupModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = () => {
    if (selectedOption) {
      const selected = assessmentOptions.find(opt => opt.id === selectedOption);
      onSelect(selected?.label || selectedOption);
      setSelectedOption("");
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedOption("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-[#6c2bd9]" />
            <h2 className="text-lg font-semibold text-gray-900">
              Select Assessment Group Relation
            </h2>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {assessmentOptions.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-3 hover:bg-gray-50"
            >
              <input
                type="radio"
                name="assessmentGroup"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mt-1 h-4 w-4 text-[#6c2bd9] focus:ring-[#6c2bd9]"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9] focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedOption}
            className="rounded-md bg-[#6c2bd9] px-4 py-2 text-sm font-medium text-white hover:bg-[#5922b8] focus:outline-none focus:ring-2 focus:ring-[#6c2bd9] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssessmentGroupModal;