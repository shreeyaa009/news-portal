"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  status: string;
  views: number;
  category_name: string | null;
  author_name: string | null;
  created_at: string;
};

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const totalArticles = articles.length;

  const publishedArticles = articles.filter(
    (article) => article.status === "published"
  ).length;

  const draftArticles = articles.filter(
    (article) => article.status === "draft"
  ).length;

  const totalViews = articles.reduce(
    (total, article) => total + Number(article.views || 0),
    0
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="text-sm font-semibold">Loading dashboard...</p>
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
              Dashboard
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              Manage your news portal from one place.
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className="inline-block bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            + New article
          </Link>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 border-l border-black md:grid-cols-4">
          <div className="border-b border-r border-black p-6 md:border-b-0">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total articles
            </p>

            <p className="mt-4 text-4xl font-black">
              {totalArticles}
            </p>
          </div>

          <div className="border-b border-r border-black p-6 md:border-b-0">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Published
            </p>

            <p className="mt-4 text-4xl font-black">
              {publishedArticles}
            </p>
          </div>

          <div className="border-b border-r border-black p-6 md:border-b-0">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Drafts
            </p>

            <p className="mt-4 text-4xl font-black">
              {draftArticles}
            </p>
          </div>

          <div className="border-b border-r border-black p-6 md:border-b-0">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total views
            </p>

            <p className="mt-4 text-4xl font-black">
              {totalViews}
            </p>
          </div>
        </section>

        {/* Management */}
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between border-b border-black pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Management
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Quick actions
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 border-l border-t border-black md:grid-cols-3">
            <Link
              href="/admin/articles"
              className="border-b border-r border-black p-6 transition hover:bg-black hover:text-white"
            >
              <p className="text-lg font-black">
                Manage articles →
              </p>

              <p className="mt-2 text-sm text-gray-500">
                View, edit, publish and delete articles.
              </p>
            </Link>

            <Link
              href="/admin/articles/new"
              className="border-b border-r border-black p-6 transition hover:bg-black hover:text-white"
            >
              <p className="text-lg font-black">
                Create article →
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Write and publish a new news article.
              </p>
            </Link>

            <Link
              href="/admin/categories"
              className="border-b border-r border-black p-6 transition hover:bg-black hover:text-white"
            >
              <p className="text-lg font-black">
                Categories →
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Create and manage news categories.
              </p>
            </Link>
          </div>
        </section>

        {/* Recent articles */}
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between border-b border-black pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Content
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Recent articles
              </h2>
            </div>

            <Link
              href="/admin/articles"
              className="text-sm font-bold underline underline-offset-4"
            >
              View all
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="border border-black p-8 text-center">
              <p className="font-bold">No articles yet.</p>

              <Link
                href="/admin/articles/new"
                className="mt-3 inline-block text-sm underline underline-offset-4"
              >
                Create your first article
              </Link>
            </div>
          ) : (
            <div className="border-t border-black">
              {articles.slice(0, 5).map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col gap-4 border-b border-black py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-lg font-bold hover:underline"
                    >
                      {article.title}
                    </Link>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>
                        {article.category_name || "Uncategorized"}
                      </span>

                      <span>•</span>

                      <span>
                        {article.author_name || "Unknown author"}
                      </span>

                      <span>•</span>

                      <span>
                        {Number(article.views || 0)} views
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-block border px-3 py-1 text-xs font-bold uppercase ${
                        article.status === "published"
                          ? "border-black bg-black text-white"
                          : "border-gray-400 text-gray-500"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-black px-6 py-6">
        <div className="mx-auto flex max-w-7xl justify-between">
          <Link href="/" className="text-sm font-black">
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