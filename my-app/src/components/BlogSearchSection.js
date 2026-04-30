"use client";

import { useState } from "react";
import BlogSlider from "@/components/BlogSlider";

function getBlogSearchText(blog) {
  return [
    blog.title,
    blog.slug,
    blog.category,
    blog.excerpt,
    blog.content,
    blog.readTime,
    blog.publishedAt,
    blog.updatedAt,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase();
}

export default function BlogSearchSection({ blogs = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const normalisedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredBlogs = normalisedSearchQuery
    ? blogs.filter((blog) => getBlogSearchText(blog).includes(normalisedSearchQuery))
    : blogs;

  return (
    <div className="mt-14">
      <div className="mx-auto max-w-6xl">
        <label htmlFor="public-blog-search" className="sr-only">
          Search blog articles
        </label>
        <input
          id="public-blog-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by title, category, topic, or article content"
          className="w-full rounded-2xl border border-[#d8dfeb] bg-white px-4 py-3 text-sm font-medium text-[#42454c] outline-none transition placeholder:text-[#8a90a0] focus:border-[#926ab9]"
        />
        <p className="mt-2 text-sm text-[#5d6169]">
          Showing {filteredBlogs.length} of {blogs.length} articles.
        </p>
      </div>

      {filteredBlogs.length ? (
        <div className="mt-6">
          <BlogSlider blogs={filteredBlogs} showHeader={false} />
        </div>
      ) : (
        <p className="mx-auto mt-6 max-w-6xl rounded-2xl border border-[#d8dfeb] bg-white/75 px-6 py-5 text-sm text-[#5d6169]">
          No blog articles match your search.
        </p>
      )}
    </div>
  );
}
