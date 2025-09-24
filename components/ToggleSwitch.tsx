"use client";
import React from "react";

type ToggleSwitchProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, checked, onChange, className }) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        onKeyDown={onKeyDown}
        className={`relative inline-flex h-7 w-14 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 active:scale-[0.99] ${
          checked ? "bg-purple-700 border-purple-700" : "bg-gray-200 border-gray-300"
        }`}
      >
        <span aria-hidden className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-7" : "translate-x-1"}`} />
        <span className="sr-only">{label}</span>
      </button>
      <div className="mt-1 text-xs text-gray-600">{checked ? "Active" : "Inactive"}</div>
    </div>
  );
};

export default ToggleSwitch;

