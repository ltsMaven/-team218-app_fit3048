import { getServerSupabaseClient } from "./supabase-server";

export const ENQUIRY_SUBMISSIONS_TABLE = "enquiry_submissions";
export const MAX_ENQUIRY_MESSAGE_WORDS = 300;

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

export function validateEnquirySubmission(payload = {}) {
  const firstName = sanitizeText(payload.f_name || payload.firstName);
  const lastName = sanitizeText(payload.l_name || payload.lastName);
  const fallbackName = sanitizeText(payload.name);
  const name = [firstName, lastName].filter(Boolean).join(" ") || fallbackName;
  const email = sanitizeText(payload.email);
  const message = sanitizeText(payload.message);
  const captchaToken = sanitizeText(payload.captchaToken);

  if (!firstName || !email || !message) {
    return {
      error: "First name, email, and message are required.",
    };
  }

  if (!namePattern.test(firstName) || (lastName && !namePattern.test(lastName))) {
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

  if (countWords(message) > MAX_ENQUIRY_MESSAGE_WORDS) {
    return {
      error: `Message must be ${MAX_ENQUIRY_MESSAGE_WORDS} words or fewer.`,
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
      message,
    },
  };
}

function buildEnquiryRecord(data) {
  return {
    first_name: data.firstName,
    last_name: data.lastName || null,
    name: data.name,
    email: data.email,
    message: data.message,
  };
}

export async function saveEnquirySubmission(payload) {
  const validated = validateEnquirySubmission(payload);

  if (validated.error) {
    return {
      error: validated.error,
      status: 400,
    };
  }

  const supabase = getServerSupabaseClient();
  const record = buildEnquiryRecord(validated.data);
  const { data, error } = await supabase
    .from(ENQUIRY_SUBMISSIONS_TABLE)
    .insert([record])
    .select()
    .single();

  if (error) {
    return {
      error: `Supabase enquiry insert failed: ${error.message}`,
      status: 500,
    };
  }

  return {
    data,
    enquiry: validated.data,
    status: 201,
  };
}
