"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../components/Sidebar";
import Header from "../../../../../components/Header";
import FormInput from "../../../../../components/FormInput";
import CheckboxGroup from "../../../../../components/CheckboxGroup";
import ToggleSwitch from "../../../../../components/ToggleSwitch";
import Toast from "../../../../../components/Toast";
import { Inter } from "next/font/google";
import { useParams } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const EditAdminPage = () => {
  const params = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Color tokens per requirement
  const purple = "#6B21A8";
  const hoverPurple = "#581C87";

  // Form state (start empty so no placeholder data shown while loading)
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [roleName, setRoleName] = useState("");
  const [features, setFeatures] = useState({
    subjects: false,
    teachers: false,
    classes: false,
    report: false,
    payment: false,
    settings: false,
  });
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const toggleFeature = (key: keyof typeof features) =>
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));

  // Fade-in
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Toast
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    const payload = { id: String(params?.id || ""), adminName, email, roleName, features, active };
    console.log("Save payload:", payload);
    setShowToast(true);
  };

  // Load admin data by id so edit form matches selected admin
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        // Resolve id safely. If invalid, stop early to avoid fetch errors.
        const raw = (params as any)?.id;
        const id = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
        if (!id) {
          throw new Error("Invalid admin id");
        }
        const controller = new AbortController();
        const res = await fetch(`/api/admins/${encodeURIComponent(id)}` , { signal: controller.signal });
        if (!res.ok) throw new Error(`Load failed (${res.status})`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        setAdminName(data.name || "");
        setEmail(data.email || "");
        setRoleName(data.role || "");
        // Map numeric features count to first-N features checked
        const n: number = Number(data.features || 0);
        const order: (keyof typeof features)[] = ["subjects", "teachers", "classes", "report", "payment", "settings"];
        const next: any = {};
        order.forEach((k, idx) => (next[k] = idx < n));
        setFeatures(next);
        setActive((data.status || "Active") === "Active");
      } catch (e: any) {
        setLoadError(e?.message || "Failed to load admin data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
    <div className={`min-h-screen bg-[#f8f8f8] ${inter.className}`}>
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 min-h-screen flex flex-col">
          {/* Topbar for role-access with correct layering and margin-left */}
          <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />

          {/* Main content must not overlap sidebar: relative z-0 ml-64 */}
          <main className="relative z-0 ml-64 p-4 md:p-6 lg:p-8 bg-transparent">
            <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
              <ol className="flex items-center gap-2">
                <li>Role &amp; Access Management</li>
                <li aria-hidden className="text-gray-400">/</li>
                <li>Admin Detail</li>
                <li aria-hidden className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">Edit Admin</li>
              </ol>
            </nav>

            <div
              className={`bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-opacity duration-300 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Edit Admin</h1>
                  {/* Admin name only appears after data is loaded */}
                  {!loading && adminName && (
                    <p className="text-sm text-gray-500 mt-1">{adminName}</p>
                  )}
                </div>
                {/* Status badge hidden while loading so no misleading state */}
                {!loading && (
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                    {active ? "Active" : "Inactive"}
                  </span>
                )}
              </div>

              <div className="p-6 grid grid-cols-1 gap-4">
                {loading && <div className="text-sm text-gray-500">Loading admin data...</div>}
                {loadError && <div className="text-sm text-red-600">{loadError}</div>}

                {/* Show the form only after data is loaded successfully */}
                {!loading && !loadError && (
                  <>
                    <FormInput id="adminName" label="Admin Name" value={adminName} onChange={setAdminName} placeholder="Admin Name" />

                    <FormInput id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="Email" />

                    <FormInput id="roleName" label="Role Name" value={roleName} onChange={setRoleName} disabled placeholder="Role" />

                    <CheckboxGroup
                      label="Accessible Features"
                      options={[
                        { id: "subjects", label: "Subjects Management", checked: features.subjects },
                        { id: "teachers", label: "Teachers Management", checked: features.teachers },
                        { id: "classes", label: "Classes Management", checked: features.classes },
                        { id: "report", label: "Students Report Management", checked: features.report },
                        { id: "payment", label: "Payment Administration", checked: features.payment },
                        { id: "settings", label: "School Settings", checked: features.settings },
                      ]}
                      onToggle={(id) => toggleFeature(id as keyof typeof features)}
                    />

                    <ToggleSwitch id="status" label="Status" checked={active} onChange={setActive} />

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-[0.98]"
                        style={{ backgroundColor: purple }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverPurple)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = purple)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M3 6a3 3 0 0 1 3-3h8.586a2 2 0 0 1 1.414.586l3.414 3.414A2 2 0 0 1 20 8.414V19a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Z" />
                          <path d="M7 7.5A1.5 1.5 0 0 1 8.5 6h3A1.5 1.5 0 0 1 13 7.5v3A1.5 1.5 0 0 1 11.5 12h-3A1.5 1.5 0 0 1 7 10.5v-3Z" />
                          <path d="M7 15a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" />
                        </svg>
                        <span>Save Data</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Toast message="Admin data saved successfully" show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default EditAdminPage;
