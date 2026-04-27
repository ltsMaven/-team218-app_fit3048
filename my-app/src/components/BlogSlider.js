"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function BlogSlider({ blogs = [] }) {
  const trackRef = useRef(null);

  function scrollTrack(direction) {
    if (!trackRef.current) {
      return;
    }

    const amount = Math.round(trackRef.current.clientWidth * 0.82);
    trackRef.current.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  if (!blogs.length) {
    return (
      <p className="rounded-2xl border border-[#d8dfeb] bg-white/70 px-6 py-5 text-center text-sm text-[#5d6169]">
        No published blogs are available yet.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollTrack("prev")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfeb] bg-white/80 text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
          aria-label="Scroll blog cards left"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollTrack("next")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfeb] bg-white/80 text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
          aria-label="Scroll blog cards right"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {blogs.map((blog, index) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.slug}`}
            className={`min-w-[18rem] snap-start overflow-hidden rounded-[2rem] border border-[#d8dfeb] shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(66,69,76,0.08)] sm:min-w-[22rem] lg:min-w-[24rem] ${
              index % 3 === 1
                ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(220,233,248,0.85))]"
                : "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,239,248,0.7))]"
            }`}
          >
            {blog.imageUrl ? (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="h-52 w-full object-cover"
              />
            ) : null}

            <div className="p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-white/80 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
                  {blog.category}
                </span>
                <span className="text-sm text-[#6a6e77]">{blog.readTime}</span>
              </div>

              <h3 className="mt-6 text-2xl font-semibold leading-tight text-[#42454c]">
                {blog.title}
              </h3>
              <p className="mt-4 text-[0.98rem] leading-8 text-[#5d6169]">
                {blog.excerpt}
              </p>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#4b8e9a] transition hover:text-[#926ab9]">
                Read article
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
