"use client";
import React, { useEffect } from "react";

type ToastProps = { message: string; show: boolean; onClose: () => void; duration?: number };

const Toast: React.FC<ToastProps> = ({ message, show, onClose, duration = 2500 }) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [show, onClose, duration]);

  return (
    <div role="status" aria-live="polite" className={`fixed top-4 right-4 z-[100] transition-all ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
      <div className="flex items-center gap-2 bg-green-600 text-white rounded-lg shadow-md px-3 py-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.63-1.63a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.143-.094l3.753-5.244Z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;

