"use client";

import * as React from "react";
import { Save } from "lucide-react";
import BaseConfirmModal from "./_BaseConfirmModal";

type Props = {
  open: boolean;
  msg?: string;                         // contoh: "Mathematics"
  onConfirm: () => void;
  onClose: () => void;
};

export default function AddSubjectModal({
  open,
  msg,
  onConfirm,
  onClose,
}: Props) {
  const title = `Add ${msg}?`;
  const message = `Are you sure want to add this ${msg ? `${msg}` : "this subject"}?`;
  return (
    <BaseConfirmModal
      open={open}
      title={title}
      message={message}
      confirmLabel="Yes, Save"
      cancelLabel="No"
      onConfirm={onConfirm}
      onClose={onClose}
      accent="#4A00E0"                    // <-- ADD
      icon={<Save className="h-4 w-4" />}
    />
  );
}