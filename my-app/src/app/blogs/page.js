import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedBlogs } from "@/lib/blogs";

export const metadata = {
  title: "Blogs | Ability to Thrive",
  description:
    "Explore articles from Ability to Thrive on counselling, recovery, boundaries, and emotional wellbeing.",
};

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <section className="min-h-screen bg-[#f8f8f6] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            Blogs
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c] sm:text-5xl">
            Articles, reflections, and practical support
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#5d6169]">
            A growing space for grounded writing on emotional wellbeing,
            counselling, recovery, and the everyday work of moving forward.
          </p>
        </div>

        {blogs.length ? (
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className={`rounded-[2rem] border border-[#d8dfeb] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(66,69,76,0.08)] ${
                  index % 3 === 1
                    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(220,233,248,0.86))]"
                    : "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,239,248,0.72))]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-white/80 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
                    {blog.category}
                  </span>
                  <span className="text-sm text-[#6a6e77]">{blog.readTime}</span>
                </div>

                <h2 className="mt-6 text-2xl font-semibold leading-tight text-[#42454c]">
                  {blog.title}
                </h2>
                <p className="mt-4 text-[0.98rem] leading-8 text-[#5d6169]">
                  {blog.excerpt}
                </p>

                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#4b8e9a] transition hover:text-[#926ab9]">
                  Read article
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-14 rounded-2xl border border-[#d8dfeb] bg-white/75 px-6 py-5 text-sm text-[#5d6169]">
            No published blog articles are available yet.
          </p>
        )}

        <div className="mt-14">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-[#926ab9] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
          >
            Book a Session
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
