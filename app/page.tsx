<<<<<<< HEAD
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">School Management Demo</h1>
      <p className="mb-4">Open the Edit Admin page:</p>
      <a className="text-purple-700 underline" href="/role-access/admin/123/edit">
        /role-access/admin/123/edit
      </a>
    </main>
  );
}

=======
"use client";
import Link from "next/link";
import { Inter } from "next/font/google";
import { User, UserSquare } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={`${inter.className} flex min-h-svh flex-col bg-white md:flex-row`}>
      {/* LEFT: role selector (selalu tampil) */}
      <section className="flex w-full flex-col px-4 py-6 sm:p-8 md:flex-1">
        {/* Brand */}
        <div className="flex items-center gap-3 text-[#6B21A8]">
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2 1 7l11 5 11-5-11-5Zm0 8.8L4.1 7 12 3.9 19.9 7 12 10.8Z" />
            <path d="M22 10.7 12 15 2 10.7V13l10 4.6 10-4.6v-2.3Z" />
          </svg>
          <span className="text-xl font-semibold">Tygo School OS</span>
        </div>

        {/* Content */}
        <div className="mx-auto mt-24 w-full max-w-xl md:mx-0">
          <h1 className="text-4xl font-bold text-gray-900">Login</h1>
          <p className="mt-2 text-base text-gray-700">Login as :</p>

          <div className="mt-8 space-y-5">
            {/* Admin */}
            <Link
              href="/login/admin"
              aria-label="Login as Admin"
              className="relative inline-flex h-14 w-full items-center justify-center rounded-2xl border-2 border-violet-600 text-violet-700 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              {/* icon kiri, label center */}
              <span className="absolute left-5 inline-flex items-center gap-2">
                <User className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold">Admin</span>
            </Link>

            {/* Teacher */}
            <Link
              href="/login/teacher"
              aria-label="Login as Teacher"
              className="relative inline-flex h-14 w-full items-center justify-center rounded-2xl border-2 border-violet-600 text-violet-700 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <span className="absolute left-5 inline-flex items-center gap-2">
                <UserSquare className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold">Teacher</span>
            </Link>
          </div>
        </div>
      </section>

      {/* RIGHT: gradient hero (DISABLED di mobile, 50% di desktop) */}
      <section className="hidden items-center justify-center bg-gradient-to-br from-[#6B21A8] to-[#4C1D95] p-12 text-white md:flex md:flex-1">
        <div className="max-w-md text-left">
          <h2 className="mb-4 text-3xl font-light md:text-4xl">
            Welcome to <span className="font-bold">Tygo School Operating System</span>
          </h2>
          <p className="text-lg leading-relaxed text-purple-100">
            A smart, integrated school platform to track student performance,
            strengthen teacher-parent communication, and simplify tuition payments — all in one place.
          </p>
        </div>
      </section>
    </div>
  );
}
>>>>>>> 32ba9d13ef15255af8df84055de8ed8720e35277
