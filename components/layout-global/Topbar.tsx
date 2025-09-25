"use client";
import React, { useState } from "react";

type TopbarProps = {
  onToggleSidebar?: () => void;
  // If true, topbar leaves a left offset for the fixed sidebar (ml-64).
  // Dashboard page uses a spacer, so it passes offset={false}.
  offset?: boolean;
};

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, offset = true }) => {
  const [language, setLanguage] = useState("English");
  return (
    <header
      className={`sticky top-0 z-20 h-[60px] bg-white border-b border-gray-200 flex items-center px-4 md:px-6 ${
        offset ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
      }`}
    >
      <button
        className="md:hidden mr-3 inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100"
        aria-label="Open sidebar"
        onClick={onToggleSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <div className="relative">
          <label htmlFor="lang" className="sr-only">Language</label>
          <select
            id="lang"
            className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-purple-700"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Bahasa Indonesia</option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">▼</div>
        </div>

        <button className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V8.25A6 6 0 0 0 6 8.25v1.5a8.967 8.967 0 0 1-2.311 6.022c1.773.64 3.62 1.085 5.454 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">11</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <div className="text-sm font-semibold text-gray-800">Dafa Aulia</div>
            <div className="text-xs text-gray-500">Superadmin</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-700">DA</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
