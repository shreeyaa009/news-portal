"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category_name: string | null;
  category_slug: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      if (!searchQuery.trim()) {
        setArticles([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/articles?search=${encodeURIComponent(
            searchQuery
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to search articles");
        }

        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
        setError("Unable to search articles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [searchQuery]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(query.trim());
  };

  const formatDate = (date: string | null) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-white text-black">
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

            <Link href="/category/technology" className="hover:underline">
              Technology
            </Link>

            <Link href="/category/sports" className="hover:underline">
              Sports
            </Link>

            <Link href="/search" className="font-bold underline">
              Search
            </Link>

            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Search
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            Find a story
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Search our latest articles by title, excerpt, or content.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="h-14 flex-1 border border-black px-5 text-base outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="h-14 bg-black px-8 font-bold text-white transition hover:bg-gray-800"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="py-16 text-center text-gray-500">
            Searching...
          </div>
        )}

        {error && (
          <div className="mt-8 border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && searchQuery && (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between border-b border-black pb-4">
              <h2 className="text-2xl font-bold">
                Search results
              </h2>

              <span className="text-sm text-gray-500">
                {articles.length}{" "}
                {articles.length === 1 ? "story" : "stories"}
              </span>
            </div>

            {articles.length === 0 ? (
              <div className="py-16 text-center">
                <h3 className="text-2xl font-bold">
                  No stories found
                </h3>

                <p className="mt-3 text-gray-500">
                  Try searching for a different keyword.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-300">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="grid gap-6 py-8 md:grid-cols-[240px_1fr]"
                  >
                    <div className="aspect-16/10 overflow-hidden bg-gray-100">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                        {article.category_name && (
                          <span>{article.category_name}</span>
                        )}

                        <span className="text-gray-400">
                          {formatDate(article.published_at || article.created_at)}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black leading-tight">
                        <Link
                          href={`/articles/${article.id}`}
                          className="hover:underline"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      {article.excerpt && (
                        <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                          {article.excerpt}
                        </p>
                      )}

                      {article.author_name && (
                        <p className="mt-5 text-sm text-gray-500">
                          By{" "}
                          <span className="font-medium text-black">
                            {article.author_name}
                          </span>
                        </p>
                      )}

                      <Link
                        href={`/articles/${article.id}`}
                        className="mt-5 inline-block text-sm font-bold underline underline-offset-4"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <div className="mt-16 border-t border-black pt-8">
            <p className="text-sm text-gray-500">
              Enter a keyword above to search the newsroom.
            </p>
          </div>
        )}now 
      </section>

      <footer className="border-t border-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-sm">
          <p>© 2026 NEWSROOM</p>

          <Link href="/" className="font-bold hover:underline">
            Back to Home
          </Link>
        </div>
      </footer>
    </main>
  );
}