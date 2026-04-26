import { hasAuth0Config } from "@/lib/auth0";
import { requireAdminSession } from "@/lib/admin-access";
import AdminBlogsManager from "@/components/AdminBlogsManager";
import { getAdminBlogs } from "@/lib/blogs";

export const metadata = {
  title: "Admin Blogs",
  description: "Admin blog management area for Ability to Thrive.",
};

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  if (!hasAuth0Config) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-10 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            Blogs
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
            Auth0 setup required
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#5d6169]">
            Add your Auth0 environment variables before using the admin blogs
            area.
          </p>
        </div>
      </section>
    );
  }

  const session = await requireAdminSession("/admin/blogs");
  let blogs = [];
  let blogsError = "";

  try {
    blogs = await getAdminBlogs();
  } catch (error) {
    blogsError =
      error instanceof Error ? error.message : "Unable to load blog content.";
  }

  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
          Blogs
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
          Blog Management
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
          Signed in as {session.user.name || session.user.email}. Create,
          edit, publish, and remove blog articles used by the homepage slider
          and the public blog pages.
        </p>

        <AdminBlogsManager initialBlogs={blogs} loadError={blogsError} />
      </div>
    </section>
  );
}
