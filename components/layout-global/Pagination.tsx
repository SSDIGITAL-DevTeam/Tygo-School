"use client";
import React, { useMemo, useState } from "react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

type PaginationProps = {
  page: number;
  onPageChange: (page: number) => void;
  total?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  pageCount?: number;
};

export default function Pagination({
  page,
  onPageChange,
  total,
  pageSize = 1,
  onPageSizeChange,
  pageSizeOptions = [4, 10, 20, 50],
  pageCount,
}: PaginationProps) {
  const derivedTotalPages = pageCount ?? (total !== undefined ? Math.max(1, Math.ceil(total / Math.max(1, pageSize))) : 1);
  const [goto, setGoto] = useState<number | "">("");

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const go = (p: number) => onPageChange(clamp(p, 1, derivedTotalPages));

  const range = useMemo<(number | string)[]>(() => {
    const DOTS = "...";
    if (derivedTotalPages <= 4) return Array.from({ length: derivedTotalPages }, (_, idx) => idx + 1);
    if (page <= 3) return [1, 2, 3, DOTS, derivedTotalPages];
    if (page >= derivedTotalPages - 2) return [1, DOTS, derivedTotalPages - 2, derivedTotalPages - 1, derivedTotalPages];
    return [1, DOTS, page - 1, page, page + 1, DOTS, derivedTotalPages];
  }, [page, derivedTotalPages]);

  return (
    <div className="flex flex-col gap-3 py-4 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        {total !== undefined ? (
          <>
            Showing
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
              className="rounded-md border border-slate-300 bg-white px-3 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            from {total} data
          </>
        ) : (
          <span className="text-slate-500">Page {page} of {derivedTotalPages}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => go(1)}
          disabled={page === 1}
          className="disabled:opacity-30 hover:text-violet-600"
          aria-label="First page"
        >
          <ChevronsLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(page - 1)}
          disabled={page === 1}
          className="disabled:opacity-30 hover:text-violet-600"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {range.map((item, idx) =>
            item === "..." ? (
              <span key={`dots-${idx}`} className="px-1 text-gray-500">
                …
              </span>
            ) : (
              <button
                key={item as number}
                onClick={() => go(item as number)}
                className={[
                  "flex h-7 w-7 items-center justify-center text-sm font-medium transition",
                  page === item
                    ? "rounded-lg bg-violet-600 text-white"
                    : "rounded-lg text-gray-900 hover:bg-violet-100 hover:text-violet-700",
                ].join(" ")}
                aria-current={page === item ? "page" : undefined}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => go(page + 1)}
          disabled={page === derivedTotalPages}
          className="disabled:opacity-30 hover:text-violet-600"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(derivedTotalPages)}
          disabled={page === derivedTotalPages}
          className="disabled:opacity-30 hover:text-violet-600"
          aria-label="Last page"
        >
          <ChevronsRight className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={derivedTotalPages}
            value={goto}
            onChange={(e) => setGoto(e.target.value === "" ? "" : Number(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && goto !== "" && go(Number(goto))}
            className="h-8 w-14 rounded-md border border-slate-300 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder=""
            aria-label="Go to page"
          />
          <button
            onClick={() => goto !== "" && go(Number(goto))}
            className="text-violet-700 transition-colors hover:text-violet-800" // <- tidak pakai underline, hanya warna berubah
          >
            Go &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}