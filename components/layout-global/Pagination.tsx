"use client";
import React, { useMemo, useState } from "react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

type PaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
};

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [4, 10, 20, 50],
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const [goto, setGoto] = useState<number | "">("");

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const go = (p: number) => onPageChange(clamp(p, 1, totalPages));

  // 1 … (page-1) page (page+1) … last
  const range = useMemo<(number | string)[]>(() => {
    const DOTS = "...";
    const out: (number | string)[] = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) out.push(i);
    } else if (page <= 3) {
      out.push(1, 2, 3, DOTS, totalPages);
    } else if (page >= totalPages - 2) {
      out.push(1, DOTS, totalPages - 2, totalPages - 1, totalPages);
    } else {
      out.push(1, DOTS, page - 1, page, page + 1, DOTS, totalPages);
    }
    return out;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-between rounded-b-xl bg-white px-6 py-5 text-sm text-gray-700 shadow-sm ring-1 ring-slate-200">
      {/* Kiri */}
      <div className="flex items-center gap-2">
        Showing
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        from {total} data
      </div>

      {/* Kanan */}
      <div className="flex items-center gap-3">
        {/* panah tanpa box */}
        <button onClick={() => go(1)} disabled={page === 1} className="disabled:opacity-30 hover:text-violet-600">
          <ChevronsLeft className="h-5 w-5" />
        </button>
        <button onClick={() => go(page - 1)} disabled={page === 1} className="disabled:opacity-30 hover:text-violet-600">
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* angka: font kecil (text-sm) dan aktif = KOTAK UNGU kecil */}
        <div className="flex items-center gap-2">
          {range.map((item, idx) =>
            item === "..." ? (
              <span key={`dots-${idx}`} className="px-1 text-gray-500">…</span>
            ) : (
              <button
                key={item as number}
                onClick={() => go(item as number)}
                className={[
                  "flex items-center justify-center text-sm font-medium transition",
                  // ukuran kecil supaya selaras dengan teks "Showing"
                  page === item
                    ? "h-7 w-7 rounded-lg bg-violet-600 text-white" // KOTAK UNGU (bukan lingkaran)
                    : "h-7 w-7 rounded-lg text-gray-900 hover:bg-violet-100 hover:text-violet-700",
                ].join(" ")}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button onClick={() => go(page + 1)} disabled={page === totalPages} className="disabled:opacity-30 hover:text-violet-600">
          <ChevronRight className="h-5 w-5" />
        </button>
        <button onClick={() => go(totalPages)} disabled={page === totalPages} className="disabled:opacity-30 hover:text-violet-600">
          <ChevronsRight className="h-5 w-5" />
        </button>

        {/* input Go agak besar biar enak diklik */}
        <input
          type="number"
          min={1}
          max={totalPages}
          value={goto}
          onChange={(e) => setGoto(e.target.value === "" ? "" : Number(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && goto !== "" && go(Number(goto))}
          className="ml-2 h-9 w-16 rounded-md border border-slate-300 px-3 text-center text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={() => goto !== "" && go(Number(goto))}
          className="ml-1 text-violet-700 decoration-violet-300 hover:decoration-violet-500"
        >
          Go &gt;&gt;
        </button>
      </div>
    </div>
  );
}
