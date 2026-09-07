"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <header className="border-b border-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            NEWS.
          </Link>

          <Link
            href="/login"
            className="text-sm font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Register form */}
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
            Join NEWS.
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Create account
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            Create an account to stay connected with the latest stories.
          </p>

          {error && (
            <div className="mt-6 border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 border border-black bg-black px-4 py-3 text-sm text-white">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-bold uppercase tracking-wider"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-black px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-50"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold uppercase tracking-wider"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-black px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-bold uppercase tracking-wider"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full border border-black px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-black bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <p className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-black underline underline-offset-4"
            >
              Login
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black px-6 py-6">
        <div className="mx-auto flex max-w-7xl justify-between">
          <Link href="/" className="text-sm font-black">
            NEWS.
          </Link>

          <p className="text-xs text-gray-500">
            © 2026 News Portal
          </p>
        </div>
      </footer>
    </main>
  );
}