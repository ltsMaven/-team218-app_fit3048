import { getServerSupabaseClient } from "./supabase-server";
import { fallbackBlogEntries } from "./blogs-content";

export const BLOGS_TABLE = "blogs";

function stripHtml(value = "") {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseImageUrl(value = "") {
  return typeof value === "string" ? value.trim() : "";
}

function stripEmptyParagraphs(value = "") {
  return value
    .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normaliseBlogContent(value = "") {
  const trimmedValue = typeof value === "string" ? value.trim() : "";

  if (!trimmedValue) {
    return "";
  }

  if (/<[a-z][\s\S]*>/i.test(trimmedValue)) {
    return stripEmptyParagraphs(trimmedValue);
  }

  return stripEmptyParagraphs(
    trimmedValue
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("")
  );
}

export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function countWords(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 0;
  }

  return trimmedValue.split(/\s+/).length;
}

function getReadTime(value, explicitReadTime = "") {
  const trimmedReadTime =
    typeof explicitReadTime === "string" ? explicitReadTime.trim() : "";

  if (trimmedReadTime) {
    return trimmedReadTime;
  }

  const minutes = Math.max(1, Math.ceil(countWords(stripHtml(value)) / 180));
  return `${minutes} min read`;
}

function getTimestamp(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function normaliseBlogEntry(entry = {}, index = 0) {
  return {
    id: entry.id || `fallback-${index}`,
    slug: entry.slug || slugify(entry.title || ""),
    category: entry.category || "General",
    imageUrl: normaliseImageUrl(entry.image_url || entry.imageUrl || ""),
    readTime:
      entry.read_time || entry.readTime || getReadTime(entry.content || ""),
    title: entry.title || "Untitled article",
    excerpt: entry.excerpt || "",
    content: normaliseBlogContent(entry.content || ""),
    isPublished:
      typeof entry.is_published === "boolean"
        ? entry.is_published
        : typeof entry.isPublished === "boolean"
          ? entry.isPublished
          : true,
    sortOrder:
      typeof entry.sort_order === "number"
        ? entry.sort_order
        : typeof entry.sortOrder === "number"
          ? entry.sortOrder
          : index + 1,
    publishedAt: entry.published_at || entry.publishedAt || null,
    createdAt: entry.created_at || entry.createdAt || null,
    updatedAt: entry.updated_at || entry.updatedAt || null,
  };
}

function normaliseBlogEntries(entries = []) {
  return entries.map((entry, index) => normaliseBlogEntry(entry, index));
}

function buildBlogFieldErrors({
  title,
  rawSlug,
  category,
  excerpt,
  contentText,
  hasImage,
}) {
  const fieldErrors = {};

  if (!title) {
    fieldErrors.title = "Title is required.";
  }

  if (!category) {
    fieldErrors.category = "Category is required.";
  }

  if (!excerpt) {
    fieldErrors.excerpt = "Excerpt is required.";
  }

  if (!contentText && !hasImage) {
    fieldErrors.content =
      "Article content is required. Add text, or insert an image inside the editor.";
  }

  if (rawSlug && !slugify(rawSlug)) {
    fieldErrors.slug =
      "Slug is invalid. Use letters, numbers, or hyphens only.";
  }

  return fieldErrors;
}

function validateBlogPayload(payload = {}) {
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const rawSlug = typeof payload.slug === "string" ? payload.slug.trim() : "";
  const category =
    typeof payload.category === "string" ? payload.category.trim() : "";
  const imageUrl = normaliseImageUrl(payload.imageUrl);
  const excerpt =
    typeof payload.excerpt === "string" ? payload.excerpt.trim() : "";
  const content = normaliseBlogContent(
    typeof payload.content === "string" ? payload.content : ""
  );
  const contentText = stripHtml(content);
  const hasImage = /<img[\s\S]*?>/i.test(content);
  const isPublished = Boolean(payload.isPublished);
  const fieldErrors = buildBlogFieldErrors({
    title,
    rawSlug,
    category,
    excerpt,
    contentText,
    hasImage,
  });

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Please complete the required fields.",
      fieldErrors,
    };
  }

  const slug = slugify(rawSlug || title);

  if (!slug) {
    return {
      error: "A valid slug could not be generated for this article.",
      fieldErrors: {
        slug: "Slug is required or must be able to be generated from the title.",
      },
    };
  }

  return {
    data: {
      title,
      slug,
      category,
      imageUrl,
      excerpt,
      content,
      readTime: getReadTime(content),
      isPublished,
    },
  };
}

function buildBlogRecord(data, currentEntry = null) {
  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    image_url: data.imageUrl || null,
    excerpt: data.excerpt,
    content: data.content,
    read_time: data.readTime,
    is_published: data.isPublished,
    published_at: data.isPublished
      ? currentEntry?.published_at || currentEntry?.publishedAt || new Date().toISOString()
      : null,
    updated_at: new Date().toISOString(),
  };
}

export async function getPublishedBlogs({ limit } = {}) {
  try {
    const supabase = getServerSupabaseClient();
    let query = supabase
      .from(BLOGS_TABLE)
      .select(
        [
          "id",
          "slug",
          "category",
          "image_url",
          "read_time",
          "title",
          "excerpt",
          "content",
          "is_published",
          "published_at",
          "created_at",
          "updated_at",
        ].join(", ")
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .order("updated_at", { ascending: false });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return normaliseBlogEntries(data || []);
  } catch {
    const fallbackBlogs = normaliseBlogEntries(fallbackBlogEntries)
      .filter((blog) => blog.isPublished)
      .sort(
        (a, b) =>
          getTimestamp(b.publishedAt || b.updatedAt || b.createdAt) -
          getTimestamp(a.publishedAt || a.updatedAt || a.createdAt)
      );

    return typeof limit === "number" ? fallbackBlogs.slice(0, limit) : fallbackBlogs;
  }
}

export async function getPublishedBlogBySlug(slug) {
  try {
    const supabase = getServerSupabaseClient();
    const { data, error } = await supabase
      .from(BLOGS_TABLE)
      .select(
        [
          "id",
          "slug",
          "category",
          "image_url",
          "read_time",
          "title",
          "excerpt",
          "content",
          "is_published",
          "published_at",
          "created_at",
          "updated_at",
        ].join(", ")
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? normaliseBlogEntry(data) : null;
  } catch {
    const fallbackBlog = fallbackBlogEntries.find((blog) => blog.slug === slug);
    return fallbackBlog ? normaliseBlogEntry(fallbackBlog) : null;
  }
}

export async function getAdminBlogs() {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from(BLOGS_TABLE)
    .select(
      [
        "id",
        "slug",
        "category",
        "image_url",
        "read_time",
        "title",
        "excerpt",
        "content",
        "is_published",
        "published_at",
        "created_at",
        "updated_at",
      ].join(", ")
    )
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Supabase blog lookup failed: ${error.message}`);
  }

  return normaliseBlogEntries(data || []);
}

async function slugExists(supabase, slug, excludeId = "") {
  let query = supabase
    .from(BLOGS_TABLE)
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase blog slug lookup failed: ${error.message}`);
  }

  return Array.isArray(data) && data.length > 0;
}

export async function createBlog(payload) {
  const validated = validateBlogPayload(payload);

  if (validated.error) {
    return {
      error: validated.error,
      fieldErrors: validated.fieldErrors,
      status: 400,
    };
  }

  const supabase = getServerSupabaseClient();

  if (await slugExists(supabase, validated.data.slug)) {
    return {
      error: "This blog slug already exists. Change the title or slug.",
      fieldErrors: {
        slug: "This slug is already in use.",
      },
      status: 400,
    };
  }

  const record = {
    ...buildBlogRecord(validated.data),
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(BLOGS_TABLE)
    .insert([record])
    .select()
    .single();

  if (error) {
    return {
      error: `Supabase blog insert failed: ${error.message}`,
      status: 500,
    };
  }

  return {
    data: normaliseBlogEntry(data),
    status: 201,
  };
}

export async function updateBlog(id, payload) {
  if (!id) {
    return {
      error: "Missing blog id.",
      status: 400,
    };
  }

  const validated = validateBlogPayload(payload);

  if (validated.error) {
    return {
      error: validated.error,
      fieldErrors: validated.fieldErrors,
      status: 400,
    };
  }

  const supabase = getServerSupabaseClient();

  if (await slugExists(supabase, validated.data.slug, id)) {
    return {
      error: "This blog slug already exists. Change the title or slug.",
      fieldErrors: {
        slug: "This slug is already in use.",
      },
      status: 400,
    };
  }

  const { data: currentEntry, error: currentError } = await supabase
    .from(BLOGS_TABLE)
    .select("id, published_at")
    .eq("id", id)
    .maybeSingle();

  if (currentError) {
    return {
      error: `Supabase blog lookup failed: ${currentError.message}`,
      status: 500,
    };
  }

  const record = buildBlogRecord(validated.data, currentEntry);
  const { data, error } = await supabase
    .from(BLOGS_TABLE)
    .update(record)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      error: `Supabase blog update failed: ${error.message}`,
      status: 500,
    };
  }

  return {
    data: normaliseBlogEntry(data),
    status: 200,
  };
}

export async function deleteBlog(id) {
  if (!id) {
    return {
      error: "Missing blog id.",
      status: 400,
    };
  }

  const supabase = getServerSupabaseClient();
  const { error } = await supabase.from(BLOGS_TABLE).delete().eq("id", id);

  if (error) {
    return {
      error: `Supabase blog delete failed: ${error.message}`,
      status: 500,
    };
  }

  return {
    success: true,
    status: 200,
  };
}
