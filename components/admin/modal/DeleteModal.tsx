"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import BaseConfirmModal from "./_BaseConfirmModal";

type Props = {
  open: boolean;
  name: string;                         // contoh: "XI-A"
  onConfirm: () => void;
  onClose: () => void;
  message?: string;
};

export default function DeleteConfirmModal({
  open,
  name,
  onConfirm,
  onClose,
  message = "Are you sure want to delete this class data?",
}: Props) {
  return (
    <BaseConfirmModal
      open={open}
      title={<>Delete “{name}”?</>}
      message={message}
      confirmLabel="Yes, Delete"
      cancelLabel="No"
      onConfirm={onConfirm}
      onClose={onClose}
      accent="#FF4D4F"                     // <-- DELETE
      icon={<Trash2 className="h-4 w-4" />}
    />
  );
}