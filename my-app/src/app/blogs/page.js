import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogSlider from "@/components/BlogSlider";
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
          <div className="mt-14">
            <BlogSlider blogs={blogs} showHeader={false} />
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
