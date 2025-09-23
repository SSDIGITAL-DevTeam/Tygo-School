"use client";
import React from "react";

type FormInputProps = {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

const FormInput: React.FC<FormInputProps> = ({ id, label, type = "text", value, onChange, disabled, placeholder, className }) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-purple-700 disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  );
};

export default FormInput;

