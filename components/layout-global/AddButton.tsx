"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

type Props =
  | {
      href: string;
      onClick?: never;
      label?: string;
      entity?: string;
      className?: string;
      disabled?: boolean;
      ariaLabel?: string;
    }
  | {
      href?: undefined;
      onClick: () => void;
      label?: string;
      entity?: string;
      className?: string;
      disabled?: boolean;
      ariaLabel?: string;
    };

// tiny helper so we don't need clsx
const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

const segmentToEntity: Record<string, string> = {
  "role-access": "Role",
  subjects: "Subject",
  teachers: "Teacher",
  classes: "Class",
  "students-report-format": "Report Format",
};

function inferEntityFromPath(pathname: string) {
  const segs = pathname.split("/").filter(Boolean);
  for (let i = segs.length - 1; i >= 0; i--) {
    const hit = segmentToEntity[segs[i]];
    if (hit) return hit;
  }
  return "Item";
}

export default function AddButton(props: Props) {
  const { href, onClick, label, entity, className, disabled, ariaLabel } = props;
  const pathname = usePathname();
  const inferred = entity ?? inferEntityFromPath(pathname);
  const finalLabel = label ?? `Add ${inferred}`;

  const base = cx(
    // === exact style you requested ===
    "inline-flex items-center justify-center gap-2",
    "rounded-full bg-[#6c2bd9] px-5 py-2.5 text-sm font-semibold text-white",
    "shadow-sm transition hover:bg-[#5922b8]",
    // a11y & disabled
    "focus:outline-none focus:ring-4 focus:ring-[#6c2bd9]/30",
    disabled && "opacity-60 pointer-events-none",
    className
  );

  const aria = ariaLabel ?? finalLabel;

  if (href) {
    return (
      <Link href={href} aria-label={aria} className={base}>
        <Plus className="h-4 w-4" />
        {finalLabel}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={aria} className={base} onClick={onClick} disabled={disabled}>
      <Plus className="h-4 w-4" />
      {finalLabel}
    </button>
  );
}