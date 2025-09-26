"use client";
import * as React from "react";

type OverviewCardProps = {
  title: string;
  subtitle?: string;
  value: string | number;
  icon?: React.ReactNode;
  /** primary = card ungu (kartu pertama), default = putih */
  accent?: "primary" | "default";
  valueLabel?: string;
};

/**
 * Layout akhir:
 * ┌───────────────────────────────┐
 * │ Title                         │
 * │ Subtitle                      │   ← Bagian atas
 * │                               │   ← Extra space
 * │ [icon bubble]      BIG VALUE  │   ← Bagian bawah sejajar
 * └───────────────────────────────┘
 */
const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  subtitle,
  value,
  icon,
  accent = "default",
  valueLabel,
}) => {
  const isPrimary = accent === "primary";

  const container =
    "rounded-2xl p-6 flex flex-col shadow-sm ring-1 ring-black/5 " +
    (isPrimary
      ? "bg-gradient-to-br from-[#6c2bd9] to-[#5a23b8] text-white"
      : "bg-white text-gray-900");

  const titleCls =
    "text-base font-semibold " + (isPrimary ? "text-white" : "text-gray-900");

  const subtitleCls =
    "mt-1 text-sm " + (isPrimary ? "text-white/80" : "text-gray-500");

  // beri jarak jelas antara header dan row bawah
  const bottomRow =
    "mt-8 flex w-full items-center justify-between"; // <-- mt-8 menambah space

  const iconBubble =
    "h-12 w-12 rounded-xl grid place-content-center " +
    (isPrimary ? "bg-white/15 text-white" : "bg-[#6c2bd9]/10 text-[#6c2bd9]");

  const valueCls =
    "text-4xl font-extrabold tracking-tight " +
    (isPrimary ? "text-white" : "text-[#6c2bd9]");

  return (
    <div className={container} role="region" aria-label={title}>
      {/* Bagian atas */}
      <div>
        <h3 className={titleCls}>{title}</h3>
        {subtitle && <p className={subtitleCls}>{subtitle}</p>}
      </div>

      {/* Bagian bawah */}
      <div className={bottomRow}>
        <div className={iconBubble} aria-hidden>
          <div className="h-6 w-6">{icon}</div>
        </div>
        <div className={valueCls} aria-label={valueLabel || "value"}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
