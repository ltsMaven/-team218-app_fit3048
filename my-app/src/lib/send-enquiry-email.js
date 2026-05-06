import { Resend } from "resend";
import {
  buildEnquiryEmailHtml,
  buildEnquiryEmailText,
} from "../components/email-template";
import { validateEnquirySubmission } from "./enquiry-submissions";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEnquiryEmail(payload) {
  if (!process.env.RESEND_API_KEY) {
    return {
      error: "Missing RESEND_API_KEY environment variable.",
      status: 500,
    };
  }

  const validated = validateEnquirySubmission(payload);

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
