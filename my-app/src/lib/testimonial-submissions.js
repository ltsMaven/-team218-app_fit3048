import { getServerSupabaseClient } from "./supabase-server";

export const TESTIMONIALS_TABLE = "testimonials";
export const MAX_TESTIMONIAL_WORDS = 220;

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
  const rating = sanitizeText(payload.rating);
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
      rating,
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
    rating: data.rating || null,
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
