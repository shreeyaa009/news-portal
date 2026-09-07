"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.location.href = "/";
  };

  return (
    <header className="border-b border-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight"
        >
          NEWSROOM
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          <Link
            href="/category/technology"
            className="hover:underline"
          >
            Technology
          </Link>

          <Link
            href="/category/sports"
            className="hover:underline"
          >
            Sports
          </Link>

          <Link href="/search" className="hover:underline">
            Search
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="font-bold hover:underline"
                >
                  Admin
                </Link>
              )}

              <span className="text-gray-500">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="font-bold hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>

              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}