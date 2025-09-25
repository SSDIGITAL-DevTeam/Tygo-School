"use client";
import React, { useState } from "react";
import Sidebar from "../../../../../components/Sidebar";
import Topbar from "../../../../../components/Topbar";
import SectionCard from "../../../../../components/SectionCard";
import ConfirmDialog from "../../../../../components/ConfirmDialog";
import { Inter } from "next/font/google";
import { ArrowLeft, Users, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const AddAdminPage: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const toggleFeature = (v: string) => setFeatures((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  // Confirm dialog
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Simple validation
  const isValidEmail = (v: string) => /.+@.+\..+/.test(v);
  const canSubmit = name.trim().length >= 2 && isValidEmail(email) && password.length >= 6 && role.trim().length >= 2;

  const onSave = async () => {
    setOpen(false);
    setSaving(true);
    try {
      const payload = { name, email, password, role, features };
      console.log("Create admin payload:", payload);
      // Simulate network
      await new Promise((r) => setTimeout(r, 800));
      // Reset
      setName(""); setEmail(""); setPassword(""); setRole(""); setFeatures([]);
      alert("Admin created successfully (mock)");
    } finally {
      setSaving(false);
    }
  };

  const featureList = [
    "Subjects Management",
    "Teachers Management",
    "Classes Management",
    "Students Report Management",
    "Payment Administration",
    "School Settings",
  ];

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen">
        {/* Sidebar and spacer */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="w-64 shrink-0" aria-hidden />

        {/* Content */}
        <div className="flex-1 min-h-screen relative z-0 bg-slate-100">
          <Topbar offset={false} onToggleSidebar={() => setSidebarOpen((s) => !s)} />
          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Breadcrumb + back */}
            <div className="text-sm text-gray-600 flex items-center gap-3">
              <button
                aria-label="Go back"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9] rounded"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <span className="text-gray-400">/</span>
              <span>Role &amp; Access Management</span>
              <span className="text-gray-400">/</span>
              <span className="font-medium text-gray-900">Add Admin</span>
            </div>

            {/* Title row */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 grid place-content-center">
                <Users className="w-5 h-5 text-[#6c2bd9]" />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Add Admin</h1>
            </div>

            {/* Form card */}
            <SectionCard>
              {/* Admin Name */}
              <div className="grid gap-1 mb-4">
                <label htmlFor="adminName" className="text-sm text-gray-700">Admin Name</label>
                <input
                  id="adminName"
                  aria-label="Admin Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Admin Name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                />
              </div>

              {/* Email */}
              <div className="grid gap-1 mb-4">
                <label htmlFor="email" className="text-sm text-gray-700">Email</label>
                <input
                  id="email"
                  aria-label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                />
              </div>

              {/* Password */}
              <div className="grid gap-1 mb-4">
                <label htmlFor="password" className="text-sm text-gray-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    aria-label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Name */}
              <div className="grid gap-1 mb-4">
                <label htmlFor="role" className="text-sm text-gray-700">Role Name</label>
                <input
                  id="role"
                  aria-label="Role Name"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Enter Role Name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6c2bd9]"
                />
              </div>

              {/* Accessible Features */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Accessible Features</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featureList.map((f) => (
                    <label key={f} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        aria-label={f}
                        checked={features.includes(f)}
                        onChange={() => toggleFeature(f)}
                        className="w-4 h-4 text-[#6c2bd9] focus:ring-[#6c2bd9] rounded"
                      />
                      <span className="text-sm text-gray-800">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!canSubmit || saving}
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-[#6c2bd9] px-4 py-2 text-white font-semibold hover:bg-[#5a23b8] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6c2bd9]"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Data</span>
                </button>
              </div>
            </SectionCard>
          </main>
        </div>
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={open}
        title="Add Admin?"
        description="Are you sure want to add this admin?"
        confirmText="Yes, Save"
        cancelText="No"
        loading={saving}
        onConfirm={onSave}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default AddAdminPage;

