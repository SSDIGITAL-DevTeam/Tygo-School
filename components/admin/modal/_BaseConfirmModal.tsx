"use client";

import * as React from "react";

type Props = {
  open: boolean;
  title: React.ReactNode;
  message?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  /** Hex color string, e.g. "#FF4D4F" */
  accent: string;
  /** Leading icon element */
  icon?: React.ReactNode;
  className?: string;
};

export default function BaseConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "No",
  onConfirm,
  onClose,
  accent,
  icon,
  className,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* card */}
      <div className={`relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl ${className || ""}`}>
        <div className="mb-3 flex items-start gap-3">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-md"
            style={{ backgroundColor: `${accent}1A`, color: accent }} // 10% opacity bg
            aria-hidden="true"
          >
            {icon}
          </span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        {message && (
          <p className="mb-5 ml-10 text-sm text-gray-600">{message}</p>
        )}

        <div className="ml-10 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
            style={{ backgroundColor: accent }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}