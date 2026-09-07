"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");

      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">

      {/* NAVBAR */}

      <header className="border-b border-black">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            NEWS.
          </Link>

          <Link
            href="/register"
            className="text-sm font-semibold hover:underline"
          >
            Create account
          </Link>

        </div>

      </header>


      {/* LOGIN */}

      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-6 py-16">

        <div className="w-full">

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
            Welcome back
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Login
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            Sign in to your NEWS. account.
          </p>


          <form
            onSubmit={handleLogin}
            className="mt-10 space-y-6"
          >

            {/* EMAIL */}

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
                className="w-full border border-black px-4 py-3 text-sm outline-none transition focus:bg-gray-50"
                placeholder="you@example.com"
              />

            </div>


            {/* PASSWORD */}

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black px-4 py-3 text-sm outline-none transition focus:bg-gray-50"
                placeholder="••••••••"
              />

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              className="w-full border border-black bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
            >
              Login →
            </button>

          </form>


          {/* REGISTER */}

          <p className="mt-8 text-center text-sm text-gray-500">

            Don't have an account?{" "}

            <Link
              href="/register"
              className="font-bold text-black underline underline-offset-4"
            >
              Register
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
}