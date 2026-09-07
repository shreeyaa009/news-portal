"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  category_name: string;
  published_at: string;
  views: number;
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default function CategoryPage({ params }: Props) {
  const [slug, setSlug] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      const { slug } = await params;

      setSlug(slug);

      try {
        const response = await fetch(
          `http://localhost:5000/api/articles?category=${slug}`
        );

        const data = await response.json();

        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [params]);

  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <main className="min-h-screen bg-white text-black">

      {/* NAVBAR */}

      <header className="border-b border-black">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black"
          >
            NEWS.
          </Link>

          <nav className="flex gap-6 text-sm font-medium">

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

            <Link
              href="/search"
              className="hover:underline"
            >
              Search
            </Link>

          </nav>

        </div>

      </header>


      {/* CATEGORY HEADER */}

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-16">

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
          Category
        </p>

        <h1 className="border-b border-black pb-6 text-5xl font-black md:text-7xl">
          {categoryName}
        </h1>

      </section>


      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-6 pb-20">

        {loading && (
          <p className="py-20 text-center text-sm uppercase tracking-widest text-gray-500">
            Loading stories...
          </p>
        )}


        {!loading && articles.length === 0 && (
          <div className="py-20 text-center">

            <h2 className="text-2xl font-bold">
              No stories found.
            </h2>

            <p className="mt-3 text-gray-500">
              There are no published stories in this category yet.
            </p>

          </div>
        )}


        {!loading && articles.length > 0 && (

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

            {articles.map((article) => (

              <article key={article.id}>

                <Link
                  href={`/articles/${article.id}`}
                  className="group block"
                >

                  <div className="mb-5 aspect-16/10 overflow-hidden bg-gray-100">

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

                  </div>


                  <p className="mb-3 text-xs font-bold uppercase tracking-widest">
                    {article.category_name}
                  </p>


                  <h2 className="text-2xl font-bold leading-tight group-hover:underline">
                    {article.title}
                  </h2>


                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                    {article.excerpt}
                  </p>


                  <p className="mt-5 border-t border-gray-200 pt-4 text-xs text-gray-500">
                    {new Date(
                      article.published_at
                    ).toLocaleDateString()}
                  </p>

                </Link>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}