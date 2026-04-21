import { getServerSupabaseClient } from "./supabase-server";

export const TESTIMONIALS_TABLE = "testimonials";
export const MAX_TESTIMONIAL_WORDS = 220;
export const MAX_PUBLIC_TESTIMONIALS = 3;

const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function countWords(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 0;
  }

  return trimmedValue.split(/\s+/).length;
}

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateTestimonialSubmission(payload = {}) {
  const firstName = sanitizeText(payload.firstName);
  const lastName = sanitizeText(payload.lastName);
  const name = [firstName, lastName].filter(Boolean).join(" ");
  const email = sanitizeText(payload.email);
  const displayName = sanitizeText(payload.displayName);
  const service = sanitizeText(payload.service);
  const testimonial = sanitizeText(payload.testimonial);
  const consent = Boolean(payload.consent);
  const captchaToken = sanitizeText(payload.captchaToken);

  if (!firstName || !lastName || !email || !testimonial) {
    return {
      error: "First name, last name, email, and testimonial are required.",
    };
  }

  if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
    return {
      error:
        "First name and last name may only include letters, spaces, apostrophes, and hyphens.",
    };
  }

  if (!emailPattern.test(email)) {
    return {
      error: "Enter a valid email address.",
    };
  }

  if (countWords(testimonial) > MAX_TESTIMONIAL_WORDS) {
    return {
      error: `Testimonial must be ${MAX_TESTIMONIAL_WORDS} words or fewer.`,
    };
  }

  if (!consent) {
    return {
      error: "Consent is required before submitting a testimonial.",
    };
  }

  if (!captchaToken) {
    return {
      error: "Please complete the CAPTCHA.",
    };
  }

  return {
    data: {
      firstName,
      lastName,
      name,
      email,
      displayName,
      service,
      testimonial,
      consent,
    },
  };
}

function buildTestimonialRecord(data) {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    name: data.name,
    email: data.email,
    display_name: data.displayName || null,
    service: data.service || null,
    testimonial: data.testimonial,
    consent: data.consent,
    status: "pending",
  };
}

export async function saveTestimonialSubmission(payload) {
  const validated = validateTestimonialSubmission(payload);

  if (validated.error) {
    return {
      error: validated.error,
      status: 400,
    };
  }

  const supabase = getServerSupabaseClient();
  const record = buildTestimonialRecord(validated.data);
  const { data, error } = await supabase
    .from(TESTIMONIALS_TABLE)
    .insert([record])
    .select()
    .single();

  if (error) {
    return {
      error: `Supabase insert failed: ${error.message}`,
      status: 500,
    };
  }

  return {
    data,
    testimonial: validated.data,
    status: 201,
  };
}

export async function getTestimonialSubmissions() {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from(TESTIMONIALS_TABLE)
    .select(
      [
        "id",
        "first_name",
        "last_name",
        "name",
        "email",
        "display_name",
        "service",
        "testimonial",
        "consent",
        "status",
        "created_at",
        "updated_at",
      ].join(", "),
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Supabase testimonial lookup failed: ${error.message}`);
  }

  return data || [];
}

export async function getApprovedTestimonials() {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from(TESTIMONIALS_TABLE)
    .select(
      [
        "id",
        "name",
        "display_name",
        "service",
        "testimonial",
        "status",
        "created_at",
      ].join(", ")
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(MAX_PUBLIC_TESTIMONIALS);

  if (error) {
    throw new Error(`Supabase approved testimonial lookup failed: ${error.message}`);
  }

  return data || [];
}

export async function updateTestimonialStatus(id, status) {
  if (!id) {
    return {
      error: "Missing testimonial id.",
      status: 400,
    };
  }

  if (!["pending", "approved", "rejected"].includes(status)) {
    return {
      error: "Invalid testimonial status.",
      status: 400,
    };
  }

  const supabase = getServerSupabaseClient();

  if (status === "approved") {
    const { count, error: countError } = await supabase
      .from(TESTIMONIALS_TABLE)
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .neq("id", id);

    if (countError) {
      return {
        error: `Supabase testimonial count failed: ${countError.message}`,
        status: 500,
      };
    }

    if ((count || 0) >= MAX_PUBLIC_TESTIMONIALS) {
      return {
        error: `Only ${MAX_PUBLIC_TESTIMONIALS} testimonials can be shown on the homepage. Hide one before approving another.`,
        status: 400,
      };
    }
  }

  const { data, error } = await supabase
    .from(TESTIMONIALS_TABLE)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      error: `Supabase testimonial update failed: ${error.message}`,
      status: 500,
    };
  }

  return {
    data,
    status: 200,
  };
}
