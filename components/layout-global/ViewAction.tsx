"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

type Props = {
  /** Langsung pakai href jika ingin full kontrol */
  href?: string;
  /** Atau bangun otomatis: `${base}/${id}` */
  base?: string;
  id?: string | number;
  onClick?: () => void;
  title?: string;
  className?: string;
  disabled?: boolean;
};

function buildHref({ href, base, id }: Pick<Props, "href" | "base" | "id">) {
  if (href) return href;
  if (base && id !== undefined) return `${base}/${id}`;
  return undefined;
}

export default function ViewAction({
  href,
  base,
  id,
  onClick,
  title = "View detail",
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
      <Eye className="h-5 w-5" />
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