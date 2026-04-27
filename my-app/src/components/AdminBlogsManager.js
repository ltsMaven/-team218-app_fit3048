"use client";

import { useState } from "react";
import { slugify } from "@/lib/blogs";
import RichTextEditor from "@/components/RichTextEditor";

function createEmptyBlog() {
  return {
    id: "",
    title: "",
    slug: "",
    category: "",
    imageUrl: "",
    excerpt: "",
    content: "",
    isPublished: false,
  };
}

function getStatusClasses(isPublished) {
  return isPublished
    ? "bg-[#eef6f2] text-[#3c7b5b]"
    : "bg-[#f4eff8] text-[#7d58a3]";
}

function sortBlogs(blogs) {
  return [...blogs].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

    if (dateA !== dateB) {
      return dateB - dateA;
    }

    return String(a.title).localeCompare(String(b.title));
  });
}

export default function AdminBlogsManager({
  initialBlogs = [],
  loadError = "",
}) {
  const [blogs, setBlogs] = useState(sortBlogs(initialBlogs));
  const [selectedBlogId, setSelectedBlogId] = useState(initialBlogs[0]?.id || "new");
  const [formData, setFormData] = useState(
    initialBlogs[0] ? { ...initialBlogs[0] } : createEmptyBlog()
  );
  const [hasCustomSlug, setHasCustomSlug] = useState(Boolean(initialBlogs[0]?.slug));
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  function handleCreateNew() {
    setSelectedBlogId("new");
    setFormData(createEmptyBlog());
    setHasCustomSlug(false);
    setStatus({ type: "idle", message: "" });
  }

  function handleSelectBlog(id) {
    const selectedBlog = blogs.find((blog) => blog.id === id);
    setSelectedBlogId(id);
    if (selectedBlog) {
      setFormData({ ...selectedBlog });
      setHasCustomSlug(true);
    }
    setStatus({ type: "idle", message: "" });
  }

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setFormData((current) => {
      if (name === "title") {
        return {
          ...current,
          title: value,
          slug: hasCustomSlug ? current.slug : slugify(value),
        };
      }

      if (name === "slug") {
        setHasCustomSlug(true);
      }

      return {
        ...current,
        [name]: nextValue,
      };
    });
  }

  function handleContentChange(nextContent) {
    setFormData((current) => ({
      ...current,
      content: nextContent,
    }));
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setStatus({ type: "idle", message: "" });

    try {
      const uploadPayload = new FormData();
      uploadPayload.append("file", file);

      const response = await fetch("/api/blog-images", {
        method: "POST",
        body: uploadPayload,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to upload image.");
      }

      setFormData((current) => ({
        ...current,
        imageUrl: result.imageUrl,
      }));
      setStatus({
        type: "success",
        message: "Photo uploaded.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to upload image.",
      });
    } finally {
      event.target.value = "";
      setIsUploadingImage(false);
    }
  }

  function handleRemoveImage() {
    setFormData((current) => ({
      ...current,
      imageUrl: "",
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(
        formData.id ? `/api/blogs/${formData.id}` : "/api/blogs",
        {
          method: formData.id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save blog.");
      }

      const savedBlog = result.blog;
      setBlogs((current) => {
        const nextBlogs = formData.id
          ? current.map((blog) => (blog.id === savedBlog.id ? savedBlog : blog))
          : [...current, savedBlog];

        return sortBlogs(nextBlogs);
      });
      setSelectedBlogId(savedBlog.id);
      setFormData(savedBlog);
      setHasCustomSlug(true);
      setStatus({
        type: "success",
        message: formData.id ? "Blog updated." : "Blog created.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save blog.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!formData.id) {
      setFormData(createEmptyBlog());
      setSelectedBlogId("new");
      setHasCustomSlug(false);
      return;
    }

    setIsDeleting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/blogs/${formData.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete blog.");
      }

      const remainingBlogs = blogs.filter((blog) => blog.id !== formData.id);
      setBlogs(remainingBlogs);
      setSelectedBlogId(remainingBlogs[0]?.id || "new");
      setFormData(remainingBlogs[0] ? { ...remainingBlogs[0] } : createEmptyBlog());
      setHasCustomSlug(Boolean(remainingBlogs[0]?.slug));
      setStatus({
        type: "success",
        message: "Blog deleted.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to delete blog.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-[#d8dfeb] bg-white/85 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
              Blog Posts
            </p>
            <p className="mt-2 text-sm text-[#5d6169]">
              {blogs.length} saved article{blogs.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="rounded-full bg-[#926ab9] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
          >
            New
          </button>
        </div>

        {loadError ? (
          <div className="mt-5 rounded-2xl border border-[#f0d0d0] bg-[#fff5f5] px-4 py-4 text-sm text-[#9a3f3f]">
            {loadError}
          </div>
        ) : null}

        <div className="mt-5 space-y-3">
          {blogs.map((blog) => (
            <button
              key={blog.id}
              type="button"
              onClick={() => handleSelectBlog(blog.id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                selectedBlogId === blog.id
                  ? "border-[#926ab9] bg-[#fcfbfe]"
                  : "border-[#d8dfeb] bg-[#fbfcfe] hover:border-[#926ab9]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[#42454c]">{blog.title}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${getStatusClasses(
                    blog.isPublished
                  )}`}
                >
                  {blog.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#5d6169]">{blog.category}</p>
            </button>
          ))}

          {!loadError && !blogs.length ? (
            <p className="rounded-2xl border border-[#d8dfeb] bg-[#f8f8fb] px-4 py-4 text-sm text-[#5d6169]">
              No blogs saved yet. Create the first article.
            </p>
          ) : null}
        </div>
      </aside>

      <form
        onSubmit={handleSave}
        noValidate
        className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
              {formData.id ? "Edit Blog" : "New Blog"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#42454c]">
              {formData.title || "Untitled article"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full border border-[#d8dfeb] px-4 py-2 text-sm font-medium text-[#42454c] transition hover:border-[#b04c4c] hover:text-[#b04c4c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : formData.id ? "Delete" : "Clear"}
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploadingImage}
              className="rounded-full bg-[#4b8e9a] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3e7882] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isUploadingImage
                ? "Uploading photo..."
                : isSaving
                  ? "Saving..."
                  : "Save blog"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-[#42454c]">
              Title
            </span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#42454c]">
              Slug
            </span>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#42454c]">
              Category
            </span>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-[#42454c]">
              Featured Photo
            </span>
            <div className="rounded-[1.7rem] border border-[#cfd6e2] bg-white p-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#926ab9] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7d58a3]">
                  {isUploadingImage ? "Uploading..." : "Upload photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>

                {formData.imageUrl ? (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="rounded-full border border-[#d8dfeb] px-4 py-2 text-sm font-medium text-[#42454c] transition hover:border-[#b04c4c] hover:text-[#b04c4c]"
                  >
                    Remove photo
                  </button>
                ) : null}
              </div>

              <p className="mt-3 text-sm text-[#6a6e77]">
                Upload a JPG, PNG, WEBP, or GIF image up to 5MB.
              </p>
            </div>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-[#42454c]">
              Excerpt
            </span>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
            />
          </label>

          {formData.imageUrl ? (
            <div className="md:col-span-2 rounded-[1.7rem] border border-[#d8dfeb] bg-[#f8f8fb] p-4">
              <p className="mb-3 text-sm font-medium text-[#42454c]">
                Photo Preview
              </p>
              <img
                src={formData.imageUrl}
                alt={formData.title || "Blog photo preview"}
                className="h-56 w-full rounded-[1.3rem] object-cover"
              />
            </div>
          ) : null}

          <div className="block md:col-span-2">
            <RichTextEditor
              label="Article Content"
              value={formData.content}
              onChange={handleContentChange}
            />
          </div>
        </div>

        <label className="mt-6 flex items-center gap-3 rounded-2xl border border-[#d8dfeb] bg-[#f8f8fb] px-4 py-4">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="h-4 w-4 rounded border-[#cfd6e2] text-[#926ab9]"
          />
          <span className="text-sm text-[#5d6169]">
            Publish this article so it appears on the homepage slider and the
            public blogs pages.
          </span>
        </label>

        <div className="mt-6 rounded-[2rem] border border-[#d8dfeb] bg-white/85 px-5 py-4">
          <p
            className={`text-sm ${
              status.type === "error"
                ? "text-[#b94a48]"
                : status.type === "success"
                  ? "text-[#3c7b5b]"
                  : "text-[#5d6169]"
            }`}
          >
            {status.message ||
              "Create draft articles here, then publish them when they are ready for the website."}
          </p>
        </div>
      </form>
    </div>
  );
}
