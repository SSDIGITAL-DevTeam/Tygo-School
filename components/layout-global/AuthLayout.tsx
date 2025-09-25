"use client";
import React from "react";

// Two-column auth layout with a purple gradient panel on the right (lg+)
// and stacked layout on small screens where the gradient panel appears on top.
// Children render the left/form column content.
type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    // Root container: full height with neutral background
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Responsive wrapper: column on mobile (panel on top), row on lg+ */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Welcome panel (purple gradient): top on mobile, right on desktop */}
        <section className="order-1 lg:order-2 flex-1 bg-gradient-to-br from-[#6B21A8] to-[#9333EA] flex items-center justify-center p-8 text-center">
          <div className="max-w-xl text-white space-y-4">
            {/* Heading: bold brand message */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
              Welcome to <span className="font-black">Tygo School</span> <span className="font-black">Operating System</span>
            </h2>
            {/* Subheading: supportive copy lines */}
            <p className="text-sm sm:text-base text-white/90">
              A smart, integrated school platform to track student performance, strengthen teacher-parent
              communication, and simplify tuition payments — all in one place.
            </p>
          </div>
        </section>

        {/* Left/form column: bottom on mobile, left on desktop */}
        <section className="order-2 lg:order-1 flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            {/* Brand above the card */}
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#6B21A8] text-white grid place-content-center font-bold">
                TS
              </div>
              <span className="text-lg font-semibold" style={{ color: "#6B21A8" }}>
                Tygo School OS
              </span>
            </div>
            {/* Slot for card/form content */}
            {children}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;

