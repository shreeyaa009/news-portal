"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      window.location.href = "/login";
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (user.role !== "admin") {
        window.location.href = "/";
        return;
      }

      fetchCategories();
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/categories"
      );

      if (!response.ok) {
        setError("Failed to load categories.");
        return;
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Category error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const createSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setName(value);
    setSlug(createSlug(value));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            slug,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to create category."
        );
        return;
      }

      setCategories((current) => [...current, data]);
      setName("");
      setSlug("");
    } catch (error) {
      console.error("Create category error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="text-sm font-semibold">
          Loading categories...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <header className="border-b border-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/admin"
            className="text-2xl font-black tracking-tight"
          >
            NEWS.
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm font-semibold hover:underline"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/articles"
              className="text-sm font-semibold hover:underline"
            >
              Articles
            </Link>

            <button
              onClick={handleLogout}
              className="border border-black px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="border-b border-black pb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
            Administration
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Categories
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Organize your news articles into categories.
          </p>
        </div>

        {error && (
          <div className="mt-6 border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Create category */}
        <section className="mt-10 border border-black p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            New category
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Create category
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="Category name"
              className="border border-black px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-50"
            />

            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="category-slug"
              className="border border-black px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-50"
            />

            <button
              type="submit"
              disabled={saving}
              className="bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create →"}
            </button>
          </form>
        </section>

        {/* Category list */}
        <section className="mt-10">
          <div className="mb-4 border-b border-black pb-4">
            <p className="text-sm font-bold">
              {categories.length}{" "}
              {categories.length === 1
                ? "category"
                : "categories"}
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="border border-black p-10 text-center">
              <p className="font-bold">
                No categories yet.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Create your first category above.
              </p>
            </div>
          ) : (
            <div className="border-t border-black">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col justify-between gap-3 border-b border-black py-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="text-lg font-black">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      /{category.slug}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-gray-400">
                    ID #{category.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-black px-6 py-6">
        <div className="mx-auto flex max-w-7xl justify-between">
          <Link href="/admin" className="text-sm font-black">
            NEWS.
          </Link>

          <p className="text-xs text-gray-500">
            Admin Panel © 2026
          </p>
        </div>
      </footer>
    </main>
  );
}