"use client";
import React, { useState } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const p = await res.json().catch(() => ({}));
        throw new Error(p?.detail || p?.title || "Login failed");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${inter.className} flex min-h-svh flex-col md:flex-row bg-gray-50`}>
      {/* Left column: Login card */}
      <div className="flex w-full md:flex-1 items-center justify-center px-4 py-6 sm:p-8">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          {/* Brand center */}
          <div className="mb-8 flex items-center justify-center gap-2 text-[#6B21A8]">
            <svg
              className="h-7 w-7"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2 1 7l11 5 11-5-11-5Zm0 8.8L4.1 7 12 3.9 19.9 7 12 10.8Z" />
              <path d="M22 10.7 12 15 2 10.7V13l10 4.6 10-4.6v-2.3Z" />
            </svg>
            <span className="text-xl font-semibold">Tygo School OS</span>
          </div>

          {/* Page title now left-aligned */}
          <h1 className="mb-6 text-left text-lg font-semibold text-gray-900">
            Admin Login
          </h1>

          {/* Form */}
          <form
            onSubmit={onLogin}
            className="space-y-6"
            aria-describedby={error ? "login-error" : undefined}
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full appearance-none border-b border-gray-300 bg-transparent px-1 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#6B21A8] focus:outline-none"
                required
              />
            </div>

            {/* Password + toggle */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full appearance-none border-b border-gray-300 bg-transparent px-1 pr-10 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#6B21A8] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6B21A8]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="rounded text-sm text-[#6B21A8] hover:underline focus:outline-none focus:ring-2 focus:ring-[#6B21A8]"
                >
                  Forgot Password
                </Link>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div id="login-error" role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-[#6B21A8] text-base font-semibold text-white hover:bg-[#581C87] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#6B21A8] focus:ring-offset-2"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* Right column: welcome gradient */}
      <section className="hidden md:flex md:flex-1 items-center justify-center bg-gradient-to-br from-[#6B21A8] to-[#4C1D95] p-12 text-white">
        <div className="max-w-md text-left">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Welcome to <span className="text-white">Tygo School Operating System</span>
          </h2>
          <p className="text-lg leading-relaxed text-purple-100">
            A smart, integrated school platform to track student performance,
            strengthen teacher–parent communication, and simplify tuition payments —
            all in one place.
          </p>
        </div>
      </section>

      {/* Hide native Edge/Chrome eye icon */}
      <style jsx global>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-contact-auto-fill-button {
          visibility: hidden;
          display: none;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
