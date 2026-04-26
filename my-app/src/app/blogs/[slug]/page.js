import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublishedBlogBySlug, getPublishedBlogs } from "@/lib/blogs";

function formatParagraphs(content) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Ability to Thrive",
    };
  }

  return {
    title: `${blog.title} | Ability to Thrive`,
    description: blog.excerpt,
  };
}

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export const dynamic = "force-dynamic";

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const paragraphs = formatParagraphs(blog.content);

  return (
    <article className="min-h-screen bg-[#f8f8f6] px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4b8e9a] transition hover:text-[#926ab9]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </Link>

        <div className="mt-8 rounded-[2.5rem] border border-[#d8dfeb] bg-white/90 px-6 py-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] sm:px-10 sm:py-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#eef1f6] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
              {blog.category}
            </span>
            <span className="text-sm text-[#6a6e77]">{blog.readTime}</span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#42454c] sm:text-5xl">
            {blog.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#5d6169]">{blog.excerpt}</p>

          <div className="mt-10 space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={`${blog.id}-paragraph-${index}`}
                className="text-base leading-8 text-[#4f5560] sm:text-[1.05rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
