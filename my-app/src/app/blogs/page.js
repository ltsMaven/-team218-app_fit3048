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

const blogHighlights = [
  "Practical guidance for recovery, resilience, and everyday wellbeing.",
  "Compassionate reflections on disability, addiction, and personal growth.",
  "Grounded support you can read at your own pace and return to when needed.",
];

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <section className="min-h-screen bg-[#f8f8f6] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:items-start">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
              Blogs
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c] sm:text-5xl lg:text-[3.7rem] lg:leading-[1.02]">
              Articles, reflections, and practical support
            </h1>
            <div className="mt-8 space-y-5 text-lg leading-8 text-[#5d6169]">
              <p>
                This space is dedicated to sharing insights, strategies, and
                stories that inspire growth and resilience. Here, you&apos;ll
                find practical guidance on overcoming addictions, navigating
                life with disabilities, and fostering personal development.
              </p>
              <p>
                The goal is to offer a supportive, judgment-free place where you
                can learn, reflect, and take steady steps toward a healthier and
                more empowered life, whether you&apos;re seeking tools for
                change, understanding for a loved one, or encouragement for your
                own journey.
              </p>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,239,248,0.74))] p-7 shadow-[0_18px_40px_rgba(66,69,76,0.06)]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#926ab9]">
              What You&apos;ll Find
            </p>
            <p className="mt-3 text-base leading-7 text-[#5d6169]">
              A thoughtful mix of reflections and practical reading designed to
              feel supportive, clear, and easy to return to.
            </p>

            <div className="mt-6 space-y-3">
              {blogHighlights.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/72 px-4 py-3"
                >
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef1f6] text-xs font-semibold text-[#6d7bbb]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-[#5d6169]">{item}</p>
                </div>
              ))}
            </div>
          </aside>
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
      </div>
    </section>
  );
}
