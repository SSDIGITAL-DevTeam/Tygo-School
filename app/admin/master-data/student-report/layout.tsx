"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { BookOpen } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/layout-global/Header";

const inter = Inter({ subsets: ["latin"] });

const tabs = [
  {
    label: "Assessment Category",
    href: "/master-data/student-report/assessment-category",
  },
  {
    label: "Report Format",
    href: "/master-data/student-report/report-format",
  },
] as const;

type StudentReportLayoutProps = {
  children: ReactNode;
};

const StudentReportLayout = ({ children }: StudentReportLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const activeHref =
    tabs.find((tab) => pathname?.startsWith(tab.href))?.href ?? tabs[0].href;

  return (
    <div className={`min-h-screen bg-[#f5f6fa] ${inter.className}`}>
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((open) => !open)} />

          <main className="relative z-0 p-4 md:p-6 lg:p-8 md:ml-64">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-gray-500">
              <span className="text-gray-400">Master Data</span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-700">
                Students Report Format
              </span>
            </nav>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-6">
                <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#6c2bd9]">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold text-gray-900">
                      Students Report Format
                    </h1>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 px-6">
                <div className="flex gap-6 text-sm font-semibold text-gray-600">
                  {tabs.map((tab) => {
                    const isActive = activeHref === tab.href;
                    return (
                      <Link
                        key={tab.href}
                        href={tab.href}
                        className={`relative py-4 transition focus:outline-none ${
                          isActive ? "text-[#6c2bd9]" : "hover:text-gray-800"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {tab.label}
                        {isActive && (
                          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#6c2bd9]" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#f7f8fb] px-6 pb-6 pt-5">{children}</div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentReportLayout;
