"use client";
import React from "react";

type Option = { id: string; label: string; checked: boolean };

type CheckboxGroupProps = {
  label: string;
  options: Option[];
  onToggle: (id: string) => void;
  className?: string;
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, onToggle, className }) => {
  return (
    <fieldset className={className}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">{label}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <label key={opt.id} htmlFor={opt.id} className="flex items-center gap-3 select-none">
            <input
              id={opt.id}
              type="checkbox"
              checked={opt.checked}
              onChange={() => onToggle(opt.id)}
              className="w-4 h-4 text-purple-700 focus:ring-purple-700 rounded transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700"
            />
            <span className="text-sm text-gray-800">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default CheckboxGroup;

