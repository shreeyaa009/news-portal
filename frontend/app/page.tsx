"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  category_name: string;
  published_at: string;
  views: number;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/articles"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data = await response.json();

        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setError("Unable to load stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const featuredArticle = articles[0];
  const latestArticles = articles.slice(1);

  return (
    <main className="min-h-screen bg-white text-black">

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 border-b border-black bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* LOGO */}

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            NEWS.
          </Link>


          {/* NAVIGATION */}

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">

            <Link
              href="/"
              className="transition hover:underline"
            >
              Home
            </Link>

            <Link
              href="/category/technology"
              className="transition hover:underline"
            >
              Technology
            </Link>

            <Link
              href="/category/sports"
              className="transition hover:underline"
            >
              Sports
            </Link>

            <Link
              href="/search"
              className="transition hover:underline"
            >
              Search
            </Link>

          </nav>


          {/* LOGIN */}

          <Link
            href="/login"
            className="border border-black px-5 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
          >
            Login
          </Link>

        </div>
      </header>


      {/* ================= INTRO ================= */}

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">

        <div className="flex items-end justify-between border-b border-black pb-6">

          <div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]">
              Sunday · September 2026
            </p>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              The Daily Brief.
            </h1>

          </div>


          <p className="hidden max-w-xs text-right text-sm leading-6 text-gray-500 md:block">
            News, ideas and stories worth knowing.
          </p>

        </div>

      </section>


      {/* ================= LOADING ================= */}

      {loading && (
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            Loading stories...
          </p>

        </section>
      )}


      {/* ================= ERROR ================= */}

      {!loading && error && (
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">

          <h2 className="text-2xl font-bold">
            Something went wrong.
          </h2>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

        </section>
      )}


      {/* ================= NO ARTICLES ================= */}

      {!loading && !error && articles.length === 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">

          <h2 className="text-2xl font-bold">
            No stories yet.
          </h2>

          <p className="mt-3 text-gray-500">
            Published articles will appear here.
          </p>

        </section>
      )}


      {/* ================= FEATURED ARTICLE ================= */}

      {!loading && !error && featuredArticle && (
        <section className="mx-auto max-w-7xl px-6">

          <article className="grid overflow-hidden border border-black md:grid-cols-2">

            {/* IMAGE */}

            <Link
              href={`/articles/${featuredArticle.id}`}
              className="group relative min-h-87.5 overflow-hidden bg-gray-100"
            >

              {featuredArticle.image_url ? (

                <img
                  src={featuredArticle.image_url}
                  alt={featuredArticle.title}
                  className="h-full min-h-87.5 w-full object-cover grayscale transition duration-500 group-hover:scale-105"
                />

              ) : (

                <div className="flex h-full min-h-87.5 items-center justify-center bg-gray-200">

                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    No Image
                  </span>

                </div>

              )}

            </Link>


            {/* CONTENT */}

            <div className="flex flex-col justify-between p-8 md:p-12">

              <div>

                <Link
                  href={`/category/${featuredArticle.category_name.toLowerCase()}`}
                  className="mb-5 inline-block text-xs font-bold uppercase tracking-[0.25em] hover:underline"
                >
                  {featuredArticle.category_name}
                </Link>


                <Link
                  href={`/articles/${featuredArticle.id}`}
                  className="block"
                >

                  <h2 className="text-4xl font-black leading-tight transition hover:underline md:text-5xl">
                    {featuredArticle.title}
                  </h2>

                </Link>


                <p className="mt-6 max-w-xl text-base leading-7 text-gray-600">
                  {featuredArticle.excerpt}
                </p>

              </div>


              {/* META */}

              <div className="mt-10 flex items-center justify-between border-t border-gray-300 pt-5">

                <span className="text-xs text-gray-500">
                  {new Date(
                    featuredArticle.published_at
                  ).toLocaleDateString()}
                </span>


                <Link
                  href={`/articles/${featuredArticle.id}`}
                  className="text-sm font-bold underline underline-offset-4"
                >
                  Read story →
                </Link>

              </div>

            </div>

          </article>

        </section>
      )}


      {/* ================= LATEST NEWS ================= */}

      {!loading && !error && latestArticles.length > 0 && (

        <section className="mx-auto max-w-7xl px-6 py-20">

          {/* SECTION HEADER */}

          <div className="mb-8 flex items-center justify-between border-b border-black pb-4">

            <h2 className="text-2xl font-black">
              Latest News
            </h2>

            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {latestArticles.length} Stories
            </span>

          </div>


          {/* ARTICLES */}

          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">

            {latestArticles.map((article) => (

              <article
                key={article.id}
                className="group"
              >

                {/* IMAGE */}

                <Link
                  href={`/articles/${article.id}`}
                  className="mb-5 block aspect-16/10 overflow-hidden bg-gray-100"
                >

                  {article.image_url ? (

                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center bg-gray-200">

                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        No Image
                      </span>

                    </div>

                  )}

                </Link>


                {/* CATEGORY */}

                <Link
                  href={`/category/${article.category_name.toLowerCase()}`}
                  className="mb-3 inline-block text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  {article.category_name}
                </Link>


                {/* TITLE */}

                <Link
                  href={`/articles/${article.id}`}
                  className="block"
                >

                  <h3 className="text-2xl font-bold leading-tight transition group-hover:underline">
                    {article.title}
                  </h3>

                </Link>


                {/* EXCERPT */}

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                  {article.excerpt}
                </p>


                {/* META */}

                <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">

                  <span className="text-xs text-gray-500">
                    {new Date(
                      article.published_at
                    ).toLocaleDateString()}
                  </span>


                  <Link
                    href={`/articles/${article.id}`}
                    className="text-xs font-bold uppercase tracking-wider hover:underline"
                  >
                    Read →
                  </Link>

                </div>

              </article>

            ))}

          </div>

        </section>

      )}


      {/* ================= EXPLORE ================= */}

      <section className="border-y border-black bg-black text-white">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="grid gap-10 md:grid-cols-3 md:items-center">

            <div className="md:col-span-2">

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                Explore the newsroom
              </p>

              <h2 className="text-4xl font-black leading-tight md:text-5xl">
                Find stories that matter to you.
              </h2>

            </div>


            <div className="flex md:justify-end">

              <Link
                href="/search"
                className="border border-white px-7 py-3 text-sm font-bold transition hover:bg-white hover:text-black"
              >
                Explore stories →
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-black">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-10 md:flex-row">

          <div>

            <Link
              href="/"
              className="text-lg font-black"
            >
              NEWS.
            </Link>

            <p className="mt-2 max-w-sm text-xs leading-5 text-gray-500">
              News, ideas and stories worth knowing.
            </p>

          </div>


          {/* FOOTER LINKS */}

          <div className="flex gap-6 text-xs font-semibold uppercase tracking-wider">

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

            <Link
              href="/search"
              className="hover:underline"
            >
              Search
            </Link>

            <Link
              href="/login"
              className="hover:underline"
            >
              Login
            </Link>

          </div>

        </div>


        <div className="border-t border-gray-200">

          <div className="mx-auto max-w-7xl px-6 py-5">

            <p className="text-xs text-gray-500">
              © 2026 News Portal. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}