"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type UploadLogoProps = {
  value: File | string | null;
  onChange: (value: File | string | null) => void;
  disabled?: boolean;
};

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
const MAX_SIZE = 1024 * 1024; // 1MB

const UploadLogo: React.FC<UploadLogoProps> = ({ value, onChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Generate preview URL
  const preview = useMemo(() => {
    if (!value) return null;
    if (typeof value === "string") return value;
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (preview && typeof value !== "string") URL.revokeObjectURL(preview);
    };
  }, [preview, value]);

  const triggerFile = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const validate = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only PNG, JPG, or SVG files are allowed");
      return false;
    }
    if (file.size > MAX_SIZE) {
      setError("Maximum file size is 1 MB");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!validate(file)) return;
    onChange(file);
  };

  return (
    <div className="space-y-2" aria-live="polite">
      <div
        role="button"
        aria-label="School logo uploader"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerFile();
          }
        }}
        onClick={triggerFile}
        onDragEnter={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (disabled) return;
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative flex items-center justify-center rounded-lg border-2 border-dashed ${
          dragOver ? "border-violet-400 bg-violet-50" : "border-slate-300 bg-slate-50"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} transition-colors w-28 h-28 md:w-36 md:h-36`}
      >
        {preview ? (
          <div className="relative w-full h-full overflow-hidden rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="School logo preview" className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute top-1 right-1 rounded-md bg-white/90 px-2 py-1 text-xs text-rose-600 shadow"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-xs text-gray-500">
            <span className="text-2xl text-[#6c2bd9]">+</span>
            <span>Upload</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
};

export default UploadLogo;

