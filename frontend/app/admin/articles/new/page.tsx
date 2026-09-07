"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function CreateArticlePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("draft");

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

      fetchCategories(token);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }, []);

  const fetchCategories = async (token: string) => {
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

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setTitle(value);

    if (!slug) {
      setSlug(createSlug(value));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      window.location.href = "/login";
      return;
    }

    try {
      const user = JSON.parse(userData);

      const response = await fetch(
        "http://localhost:5000/api/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            slug,
            excerpt,
            content,
            image_url: imageUrl || null,
            category_id: categoryId
              ? Number(categoryId)
              : null,
            author_id: user.id,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create article.");
        return;
      }

      window.location.href = "/admin/articles";
    } catch (error) {
      console.error("Create article error:", error);
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
          Loading...
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

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="border-b border-black pb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
            Administration
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Create article
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Write and publish a new news article.
          </p>
        </div>

        {error && (
          <div className="mt-6 border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-xs font-bold uppercase tracking-wider"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="Article title"
              className="w-full border border-black px-4 py-4 text-lg font-semibold outline-none placeholder:text-gray-400 focus:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-xs font-bold uppercase tracking-wider"
            >
              Slug
            </label>

            <input
              id="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-slug"
              className="w-full border border-black px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="mb-2 block text-xs font-bold uppercase tracking-wider"
            >
              Excerpt
            </label>

            <textarea
              id="excerpt"
              rows={4}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description of the article..."
              className="w-full resize-none border border-black px-4 py-3 text-sm leading-6 outline-none placeholder:text-gray-400 focus:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-2 block text-xs font-bold uppercase tracking-wider"
            >
              Content
            </label>

            <textarea
              id="content"
              rows={14}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article here..."
              className="w-full resize-y border border-black px-4 py-3 text-sm leading-7 outline-none placeholder:text-gray-400 focus:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-xs font-bold uppercase tracking-wider"
            >
              Image URL
            </label>

            <input
              id="image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-black px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-xs font-bold uppercase tracking-wider"
              >
                Category
              </label>

              <select
                id="category"
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                className="w-full border border-black bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-xs font-bold uppercase tracking-wider"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-black bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">
                  Published
                </option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-black pt-8 sm:flex-row sm:justify-between">
            <Link
              href="/admin/articles"
              className="border border-black px-6 py-3 text-center text-sm font-bold transition hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="bg-black px-8 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create article →"}
            </button>
          </div>
        </form>
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