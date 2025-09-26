"use client";

import Link from "next/link";
import { PenSquare } from "lucide-react";

type Props = {
  /** Langsung pakai href jika ingin full kontrol */
  href?: string;
  /** Atau bangun otomatis: `${base}/${id}/edit` */
  base?: string;
  id?: string | number;
  /** Pakai ini jika ingin button aksi bukan link */
  onClick?: () => void;
  title?: string;
  className?: string;
  disabled?: boolean;
};

function buildHref({ href, base, id }: Pick<Props, "href" | "base" | "id">) {
  if (href) return href;
  if (base && id !== undefined) return `${base}/${id}/edit`;
  return undefined;
}

export default function EditAction({
  href,
  base,
  id,
  onClick,
  title = "Edit",
  className,
  disabled,
}: Props) {
  const to = buildHref({ href, base, id });

  const common =
    "p-2 rounded-md text-[#6c2bd9] hover:bg-[#f2eaff] focus:outline-none " +
    "focus:ring-2 focus:ring-[#6c2bd9]/30 transition";
  const classes = [common, disabled ? "opacity-60 pointer-events-none" : "", className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <PenSquare className="h-5 w-5" />
      <span className="sr-only">{title}</span>
    </>
  );

  return to ? (
    <Link href={to} aria-label={title} title={title} className={classes}>
      {content}
    </Link>
  ) : (
    <button
      type="button"
      aria-label={title}
      title={title}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}