"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category_name: string | null;
  category_slug: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
  views: number;
};

export default function ArticlePage() {
  const params = useParams();
  const id = params.id;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/articles/${id}`
        );

        if (!response.ok) {
          throw new Error("Article not found");
        }

        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load this story.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const formatDate = (date: string | null) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black">
        <header className="border-b border-black">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <Link href="/" className="text-2xl font-black">
              NEWSROOM
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-gray-500">Loading story...</p>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-white text-black">
        <header className="border-b border-black">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-2xl font-black">
              NEWSROOM
            </Link>

            <Link
              href="/"
              className="text-sm font-bold underline"
            >
              Back to Home
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-500">
            404
          </p>

          <h1 className="text-4xl font-black">
            Story not found
          </h1>

          <p className="mt-4 text-gray-500">
            The article you are looking for does not exist or is no longer
            available.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block bg-black px-6 py-3 text-sm font-bold text-white hover:bg-gray-800"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

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

            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <article>
        <div className="mx-auto max-w-5xl px-6 pt-16">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold uppercase tracking-wider">
            {article.category_name && (
              <>
                <Link
                  href={`/category/${article.category_slug}`}
                  className="hover:underline"
                >
                  {article.category_name}
                </Link>

                <span className="text-gray-400">/</span>
              </>
            )}

            <span className="text-gray-500">
              {formatDate(article.published_at || article.created_at)}
            </span>
          </div>

          <h1 className="max-w-5xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-6 max-w-3xl text-xl leading-8 text-gray-600">
              {article.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-gray-300 py-5 text-sm">
            {article.author_name && (
              <span>
                By{" "}
                <strong className="font-bold">
                  {article.author_name}
                </strong>
              </span>
            )}

            <span className="text-gray-400">•</span>

            <span className="text-gray-500">
              {article.views || 0} views
            </span>
          </div>
        </div>

        {article.image_url && (
          <div className="mx-auto mt-10 max-w-6xl px-6">
            <div className="overflow-hidden bg-gray-100">
              <img
                src={article.image_url}
                alt={article.title}
                className="max-h-162.5 w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="whitespace-pre-line text-lg leading-8 text-gray-900">
            {article.content}
          </div>
        </div>

        <div className="mx-auto max-w-3xl border-t border-black px-6 py-8">
          <Link
            href="/"
            className="text-sm font-bold underline underline-offset-4"
          >
            ← Back to all stories
          </Link>
        </div>
      </article>

      <footer className="border-t border-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-sm">
          <p>© 2026 NEWSROOM</p>

          <Link href="/" className="font-bold hover:underline">
            Home
          </Link>
        </div>
      </footer>
    </main>
  );
}
