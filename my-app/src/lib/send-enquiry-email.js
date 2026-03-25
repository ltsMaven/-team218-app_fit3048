import { Resend } from "resend";
import {
  buildEnquiryEmailHtml,
  buildEnquiryEmailText,
} from "../components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

function validateEnquiry(payload = {}) {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return {
      error: "Name, email, and message are required.",
    };
  }

  return {
    data: {
      name,
      email,
      phone,
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

  const { name, email, phone, message } = validated.data;
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
      phone,
      message,
    }),
    text: buildEnquiryEmailText({
      name,
      email,
      phone,
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
