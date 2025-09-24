"use client";
import React from "react";

type OverviewCardProps = {
  title: string;
  subtitle?: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: "primary" | "default";
};

// Simple overview card used on Dashboard
const OverviewCard: React.FC<OverviewCardProps> = ({ title, subtitle, value, icon, accent = "default" }) => {
  const isPrimary = accent === "primary";
  return (
    <div
      className={`rounded-2xl border shadow-sm p-4 sm:p-5 flex items-start justify-between ${
        isPrimary ? "bg-[#6c2bd9] text-white border-transparent" : "bg-white text-gray-900 border-[#ececec]"
      }`}
    >
      <div className="space-y-1">
        <div className={`text-xs uppercase tracking-wide ${isPrimary ? "text-white/80" : "text-gray-500"}`}>{title}</div>
        {subtitle && <div className={`text-xs ${isPrimary ? "text-white/90" : "text-gray-500"}`}>{subtitle}</div>}
        <div className={`text-2xl font-bold ${isPrimary ? "text-white" : "text-gray-900"}`}>{value}</div>
      </div>
      {icon ? <div className={`w-10 h-10 rounded-lg grid place-content-center ${isPrimary ? "bg-white/10" : "bg-slate-100"}`}>{icon}</div> : null}
    </div>
  );
};

export default OverviewCard;

