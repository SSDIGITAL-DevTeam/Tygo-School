"use client";
import React from "react";

type SectionCardProps = {
  title?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
};

// Generic white card for large sections (table, filters)
const SectionCard: React.FC<SectionCardProps> = ({ title, children, headerRight }) => {
  return (
    <section className="rounded-2xl bg-white border border-[#ececec] shadow-sm">
      {(title || headerRight) && (
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#ececec]">
          {title ? <h2 className="text-lg font-semibold text-gray-900">{title}</h2> : <div />}
          {headerRight}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
};

export default SectionCard;

