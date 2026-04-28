import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublishedBlogBySlug, getPublishedBlogs } from "@/lib/blogs";

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

          {blog.imageUrl ? (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="mt-10 h-auto w-full rounded-[2rem] border border-[#d8dfeb] object-cover shadow-sm"
            />
          ) : null}

          <p className="mt-6 text-justify text-lg leading-8 text-[#5d6169]">
            {blog.excerpt}
          </p>

          <div
            className="mt-10 text-[#4f5560] [&_a]:text-[#4b8e9a] [&_a]:underline-offset-4 [&_a]:hover:text-[#926ab9] [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-[#d8dfeb] [&_blockquote]:bg-[#f8f8fb] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[#42454c] [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-[#42454c] [&_img]:my-8 [&_img]:w-full [&_img]:rounded-[1.75rem] [&_img]:border [&_img]:border-[#d8dfeb] [&_img]:shadow-sm [&_li]:leading-8 [&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:my-6 [&_p]:text-base [&_p]:leading-8 [&_p]:text-justify sm:[&_p]:text-[1.05rem] [&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
      <div className="mt-12 flex justify-center pt-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 rounded-full bg-[#926ab9] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </Link>
      </div>
    </article>
  );
}
