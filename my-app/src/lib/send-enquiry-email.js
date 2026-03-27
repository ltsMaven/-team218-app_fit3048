import { Resend } from "resend";
import {
  buildEnquiryEmailHtml,
  buildEnquiryEmailText,
} from "../components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_MESSAGE_WORDS = 300;
const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function countWords(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 0;
  }

  return trimmedValue.split(/\s+/).length;
}

function validateEnquiry(payload = {}) {
  const firstName =
    typeof payload.f_name === "string" ? payload.f_name.trim() : "";
  const lastName =
    typeof payload.l_name === "string" ? payload.l_name.trim() : "";
  const fallbackName =
    typeof payload.name === "string" ? payload.name.trim() : "";
  const name = [firstName, lastName].filter(Boolean).join(" ") || fallbackName;
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!firstName || !lastName || !email || !message) {
    return {
      error: "First name, last name, email, and message are required.",
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

  if (countWords(message) > MAX_MESSAGE_WORDS) {
    return {
      error: `Message must be ${MAX_MESSAGE_WORDS} words or fewer.`,
    };
  }

  return {
    data: {
      name,
      email,
      message,
    },
  };
}

export async function sendEnquiryEmail(payload) {
  if (!process.env.RESEND_API_KEY) {
    return {
      error: "Missing RESEND_API_KEY environment variable.",
      status: 500,
    };
  }

  const validated = validateEnquiry(payload);

  if (validated.error) {
    return {
      error: validated.error,
      status: 400,
    };
  }

  const { name, email, message } = validated.data;
  const from =
    process.env.RESEND_FROM_EMAIL || "Ability to Thrive <onboarding@resend.dev>";
  const to = process.env.RESEND_TO_EMAIL || "delivered@resend.dev";

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `New enquiry from ${name}`,
    html: buildEnquiryEmailHtml({
      name,
      email,
      message,
    }),
    text: buildEnquiryEmailText({
      name,
      email,
      message,
    }),
  });

  if (error) {
    return {
      error: error.message || "Failed to send enquiry email.",
      status: 500,
    };
  }

  return {
    data,
    status: 200,
  };
}
