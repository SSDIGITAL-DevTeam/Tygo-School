"use client";
import React from "react";

type Status = "Paid" | "Unpaid" | "Active" | "Non Active";

type StatusBadgeProps = {
  status: Status;
};

const palettes: Record<Status, { bg: string; text: string }> = {
  Paid: { bg: "bg-[#e6f7ed]", text: "text-green-700" },
  Unpaid: { bg: "bg-[#ffe9e7]", text: "text-red-600" },
  Active: { bg: "bg-[#25D366]/15", text: "text-[#1D9F4E]" },
  "Non Active": { bg: "bg-[#ED3500]/15", text: "text-[#ED3500]" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const p = palettes[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.bg} ${p.text}`}>{status}</span>
  );
};

export default StatusBadge;

