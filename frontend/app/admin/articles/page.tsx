"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  views: number;
  category_name: string | null;
  author_name: string | null;
  created_at: string;
};

export default function ManageArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

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

      fetchArticles(token);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }, []);

  const fetchArticles = async (token: string) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/articles/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/articles/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete article.");
        return;
      }

      setArticles((current) =>
        current.filter((article) => article.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to connect to the server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const filteredArticles = articles.filter((article) => {
    const matchesFilter =
      filter === "all" || article.status === filter;

    const searchText = search.toLowerCase();

    const matchesSearch =
      article.title.toLowerCase().includes(searchText) ||
      (article.category_name || "")
        .toLowerCase()
        .includes(searchText);

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="text-sm font-semibold">
          Loading articles...
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
              href="/"
              className="text-sm font-semibold hover:underline"
            >
              View site
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
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-black pb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
              Administration
            </p>

            <h1 className="text-5xl font-black tracking-tight">
              Manage articles
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              Create, edit, publish and remove news articles.
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className="bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            + New article
          </Link>
        </div>

        {/* Filters */}
        <section className="mt-8 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-black px-4 py-3 text-sm outline-none focus:bg-gray-50 md:max-w-md"
          />

          <div className="flex border border-black">
            {["all", "published", "draft"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider ${
                  filter === status
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between border-b border-black pb-4">
            <p className="text-sm font-bold">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1
                ? "article"
                : "articles"}
            </p>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="border border-black p-10 text-center">
              <p className="font-bold">
                No articles found.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="border-t border-black">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="border-b border-black py-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          {article.category_name ||
                            "Uncategorized"}
                        </span>

                        <span
                          className={`border px-2 py-1 text-[10px] font-bold uppercase ${
                            article.status === "published"
                              ? "border-black bg-black text-white"
                              : "border-gray-400 text-gray-500"
                          }`}
                        >
                          {article.status}
                        </span>
                      </div>

                      <h2 className="mt-3 text-2xl font-black">
                        {article.title}
                      </h2>

                      {article.excerpt && (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>
                          Author:{" "}
                          {article.author_name ||
                            "Unknown"}
                        </span>

                        <span>
                          Views:{" "}
                          {Number(article.views || 0)}
                        </span>

                        <span>
                          {new Date(
                            article.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-3">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="border border-black px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(article.id)
                        }
                        className="border border-red-600 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
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