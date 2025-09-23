"use client";
import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type PaginationProps = {
  page: number; // 1-based
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

// Reusable pagination with first/prev/next/last and compact numbers with ellipsis
const Pagination: React.FC<PaginationProps> = ({ page, pageCount, onPageChange, className }) => {
  if (pageCount <= 1) return null;

  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), pageCount));

  // Build visible pages: 1, current-1..current+1, last, with ellipsis
  const pages: (number | "ellipsis")[] = [];
  const add = (n: number) => pages.push(n);
  const addEllipsis = () => {
    if (pages[pages.length - 1] !== "ellipsis") pages.push("ellipsis");
  };

  add(1);
  for (let p = page - 1; p <= page + 1; p++) {
    if (p > 1 && p < pageCount) add(p);
  }
  if (pageCount > 1) add(pageCount);

  // Ensure sorted unique with ellipsis
  const uniqueSorted = Array.from(new Set(pages.filter((x) => x !== "ellipsis") as number[])).sort((a, b) => a - b);
  const final: (number | "ellipsis")[] = [];
  for (let i = 0; i < uniqueSorted.length; i++) {
    const curr = uniqueSorted[i];
    const prev = uniqueSorted[i - 1];
    if (i > 0 && prev !== undefined && curr - prev > 1) final.push("ellipsis");
    final.push(curr);
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-1">
        <button aria-label="First page" onClick={() => go(1)} disabled={page === 1} className="p-2 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50">
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button aria-label="Previous page" onClick={() => go(page - 1)} disabled={page === 1} className="p-2 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {final.map((it, idx) =>
          it === "ellipsis" ? (
            <span key={`e-${idx}`} className="px-2 text-gray-500 select-none">…</span>
          ) : (
            <button
              key={it}
              aria-current={it === page ? "page" : undefined}
              onClick={() => go(it)}
              className={`px-3 py-1.5 rounded-full border text-sm ${
                it === page ? "bg-[#6c2bd9] text-white border-transparent" : "bg-white hover:bg-gray-50 text-gray-700"
              }`}
            >
              {it}
            </button>
          )
        )}
        <button aria-label="Next page" onClick={() => go(page + 1)} disabled={page === pageCount} className="p-2 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button aria-label="Last page" onClick={() => go(pageCount)} disabled={page === pageCount} className="p-2 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50">
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

