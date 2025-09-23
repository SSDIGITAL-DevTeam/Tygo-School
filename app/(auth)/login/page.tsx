"use client";
import React, { useState } from "react";
import AuthLayout from "../../../components/AuthLayout";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

// Load Inter font for clean typography on the entire page container
const inter = Inter({ subsets: ["latin"] });

// Admin Login Page (client component)
// Implements a two-column layout: left form card, right purple gradient panel.
// All inputs are controlled; password visibility toggles with accessible button.
const LoginPage: React.FC = () => {
  const router = useRouter();
  // Controlled inputs state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit handler (demo only)
  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        // Try to read problem+json
        let msg = "Login failed";
        try {
          const p = await res.json();
          msg = p?.detail || p?.title || msg;
        } catch {}
        setError(msg);
        return;
      }
      // Success: cookies set by the server; go to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={inter.className}>
      {/* AuthLayout provides the two-column structure and welcome panel */}
      <AuthLayout>
        {/* Login card container */}
        <div className="rounded-2xl bg-white shadow-lg p-8 w-full">
          {/* Card title */}
          <h1 className="text-xl font-semibold text-gray-900 mb-6">Admin Login</h1>

          {/* Login form */}
          <form onSubmit={onLogin} className="grid gap-6" aria-describedby={error ? "login-error" : undefined}>
            {/* Email field: label -> input association via htmlFor/id */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-b border-gray-300 bg-transparent px-1 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6B21A8]"
                aria-describedby="email-help"
                required
              />
              <p id="email-help" className="mt-1 text-xs text-gray-500">
                Use your admin email address.
              </p>
            </div>

            {/* Password field with eye toggle */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b border-gray-300 bg-transparent px-1 py-2 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6B21A8]"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6B21A8]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Forgot password link */}
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-sm text-[#6B21A8] hover:underline focus:outline-none focus:ring-2 focus:ring-[#6B21A8] rounded">
                  Forgot Password
                </Link>
              </div>
            </div>

            {/* Inline error message for a11y */}
            {error && (
              <div id="login-error" role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-[#6B21A8] text-white font-semibold hover:bg-[#581C87] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B21A8]"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </AuthLayout>
    </div>
  );
};

export default LoginPage;
