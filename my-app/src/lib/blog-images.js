import { getServerSupabaseClient } from "./supabase-server";

export const BLOG_IMAGES_BUCKET = "blog-images";
const MAX_BLOG_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_BLOG_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function sanitiseFileName(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFileExtension(file) {
  const nameParts = String(file?.name || "").split(".");
  const fromName = nameParts.length > 1 ? nameParts.pop().toLowerCase() : "";

  if (fromName) {
    return fromName;
  }

  switch (file?.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

async function ensureBlogImagesBucket(supabase) {
  const { error } = await supabase.storage.createBucket(BLOG_IMAGES_BUCKET, {
    public: true,
    fileSizeLimit: MAX_BLOG_IMAGE_SIZE_BYTES,
    allowedMimeTypes: [...ALLOWED_BLOG_IMAGE_TYPES],
  });

  if (error && !/already exists/i.test(error.message || "")) {
    throw new Error(`Unable to prepare blog image storage: ${error.message}`);
  }
}

export async function uploadBlogImage(file) {
  if (!(file instanceof File)) {
    throw new Error("A valid image file is required.");
  }

  if (!ALLOWED_BLOG_IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WEBP, and GIF files are allowed.");
  }

  if (file.size > MAX_BLOG_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const supabase = getServerSupabaseClient();
  await ensureBlogImagesBucket(supabase);

  const extension = getFileExtension(file);
  const baseName = sanitiseFileName(
    String(file.name || "").replace(/\.[^.]+$/, "")
  );
  const fileName = `${Date.now()}-${crypto.randomUUID()}-${baseName || "blog-image"}.${extension}`;
  const filePath = `featured/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Unable to upload blog image: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(filePath);

  if (!publicUrl) {
    throw new Error("Unable to generate a public image URL.");
  }

  return {
    bucket: BLOG_IMAGES_BUCKET,
    path: filePath,
    publicUrl,
  };
}
