"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

type Props = {
  label?: string;                // default: "Delete Data"
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
};

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export default function DeleteButton({
  label = "Delete Data",
  type = "button",
  onClick,
  disabled,
  className,
  fullWidth,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center gap-2",
        "rounded-full px-6 py-2.5 text-base font-semibold text-white",
        "bg-[#FF4D4F] hover:bg-[#e64547] transition",
        "shadow-[0_4px_0_rgba(0,0,0,0.08)] focus:outline-none focus:ring-4 focus:ring-[#FF4D4F]/30",
        disabled && "opacity-60 pointer-events-none",
        fullWidth && "w-full",
        className
      )}
      aria-label={label}
      title={label}
    >
      <Trash2 className="h-5 w-5" />
      {label}
    </button>
  );
}