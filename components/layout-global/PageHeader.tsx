"use client";
import React from "react";

type Props = {
  /** Teks judul besar di header */
  title: string;
  /** Ikon di dalam lingkaran ungu muda (ukuran h-5 w-5 disarankan) */
  icon: React.ReactNode;
  /** Opsional: Konten di sisi kanan (misalnya tombol aksi tambahan) */
  right?: React.ReactNode;
};

/**
 * PageHeader menampilkan header halaman dengan:
 * - Lingkaran berisi ikon di sebelah kiri
 * - Judul besar
 * - Konten opsional di sebelah kanan
 */
const PageHeader: React.FC<Props> = ({ title, icon, right }) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-100">
          {icon}
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      </div>

      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
};

export default PageHeader;
