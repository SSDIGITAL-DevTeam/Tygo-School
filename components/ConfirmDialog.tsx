"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

// Accessible confirmation dialog with overlay, ESC to close, and focus management
const ConfirmDialog: React.FC<Props> = ({ open, title, description, confirmText = "Confirm", cancelText = "Cancel", loading, onConfirm, onClose }) => {
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handler);
    const t = setTimeout(() => confirmRef.current?.focus(), 0);
    return () => { window.removeEventListener("keydown", handler); clearTimeout(t); };
  }, [open, onClose, onConfirm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden />

      <div className="relative z-[101] w-full max-w-md rounded-xl bg-white shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-[#6c2bd9] px-4 py-2 text-sm font-medium text-[#6c2bd9] hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            ref={confirmRef}
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-md bg-[#6c2bd9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5a23b8] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6c2bd9]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

