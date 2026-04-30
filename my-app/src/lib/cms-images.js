import { getServiceRoleSupabaseClient } from "./supabase-server";

export const CMS_IMAGES_BUCKET = "cms-images";
const MAX_CMS_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_CMS_IMAGE_TYPES = new Set([
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

export async function uploadCmsImage(file, folder = "general") {
  if (!(file instanceof File)) {
    throw new Error("A valid image file is required.");
  }

  if (!ALLOWED_CMS_IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WEBP, and GIF files are allowed.");
  }

  if (file.size > MAX_CMS_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const supabase = getServiceRoleSupabaseClient();
  const extension = getFileExtension(file);
  const baseName = sanitiseFileName(
    String(file.name || "").replace(/\.[^.]+$/, "")
  );
  const fileName = `${Date.now()}-${crypto.randomUUID()}-${baseName || "cms-image"}.${extension}`;
  const safeFolder = sanitiseFileName(folder) || "general";
  const filePath = `${safeFolder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(CMS_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    if (/bucket/i.test(uploadError.message || "")) {
      throw new Error(
        "CMS image storage is not ready. Create a public Supabase bucket named cms-images first."
      );
    }

    throw new Error(`Unable to upload CMS image: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(CMS_IMAGES_BUCKET).getPublicUrl(filePath);

  if (!publicUrl) {
    throw new Error("Unable to generate a public image URL.");
  }

  return {
    bucket: CMS_IMAGES_BUCKET,
    path: filePath,
    publicUrl,
  };
}
