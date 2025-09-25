"use client";

import * as React from "react";
import { Save } from "lucide-react";
import BaseConfirmModal from "./_BaseConfirmModal";

type Props = {
  open: boolean;
  msg?: string;                  // default "this classes data"
  onConfirm: () => void;
  onClose: () => void;
};

export default function SaveChangesModal({
  open,
  msg,
  onConfirm,
  onClose,
}: Props) {
  return (
    <BaseConfirmModal
      open={open}
      title="Save Changes?"
      message={`Are you sure you want to save the updates to ${msg} data?`}
      confirmLabel="Yes, Save"
      cancelLabel="No"
      onConfirm={onConfirm}
      onClose={onClose}
      accent="#FFC107"                    // <-- SAVE / EDIT
      icon={<Save className="h-4 w-4" />}
    />
  );
}