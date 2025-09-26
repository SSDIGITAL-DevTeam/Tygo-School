"use client";

import * as React from "react";
import { Check } from "lucide-react";

type Props = {
  label?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  /** If true, the button stretches to full width */
  fullWidth?: boolean;
};

// tiny class joiner (avoid extra deps)
const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export default function SaveButton({
  label = "Save Data",
  type = "submit",
  onClick,
  loading = false,
  disabled = false,
  className,
  fullWidth,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cx(
        "inline-flex items-center justify-center gap-2",
        "rounded-full bg-[#4A00E0] px-5 py-2 text-sm font-semibold text-white",
        "shadow-sm transition hover:bg-[#4A00E0]",
        "focus:outline-none focus:ring-4 focus:ring-[#6c2bd9]/30",
        isDisabled && "opacity-60 pointer-events-none",
        fullWidth && "w-full",
        className
      )}
    >
      {/* Left icon: white circle with check (or spinner when loading) */}
      {loading ? (
        <span
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white"
          aria-hidden="true"
        >
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-[#4A00E0]" />
        </span>
      ) : (
        <span
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white"
          aria-hidden="true"
        >
          <Check className="h-3 w-3 text-[#6c2bd9]" />
        </span>
      )}

      {label}
    </button>
  );
}