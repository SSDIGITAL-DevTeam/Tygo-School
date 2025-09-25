"use client";

import { Download } from "lucide-react";
import React from "react";

type DownloadButtonProps = {
  label?: string;
  onClick?: () => void;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({
  label = "Download Data",
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
       className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 whitespace-nowrap"
    >
      <Download className="h-4 w-4" />
      {label}
    </button>
  );
};

export default DownloadButton;