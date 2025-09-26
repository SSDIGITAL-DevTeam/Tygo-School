"use client";
import React, { useEffect, useRef, useState } from "react";
import { Filter } from "lucide-react";

export type StatusValue = "All" | "Active" | "Non Active";

type Props = {
  value: StatusValue;
  onChange: (v: StatusValue) => void;
  options?: StatusValue[]; // default: ["All","Active","Non Active"]
  buttonLabel?: string;    // default: "Filter"
  className?: string;
};

export default function StatusFilter({
  value,
  onChange,
  options = ["All", "Active", "Non Active"],
  buttonLabel = "Filter",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        <Filter className="h-4 w-4 text-slate-500" />
        <span>{buttonLabel}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-30 mt-2 w-40 rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
        >
          {options.map((opt) => {
            const isActive = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {opt === "All" ? "All Status" : opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
