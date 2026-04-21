import { Resend } from "resend";
import {
  buildTestimonialEmailHtml,
  buildTestimonialEmailText,
} from "../components/email-template";
import { validateTestimonialSubmission } from "./testimonial-submissions";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTestimonialEmail(payload) {
  if (!process.env.RESEND_API_KEY) {
    return {
      error: "Missing RESEND_API_KEY environment variable.",
      status: 500,
    };
  }

  const validated = validateTestimonialSubmission(payload);

  if (validated.error) {
    return {
      error: validated.error,
      status: 400,
    };
  }

  const testimonialData = validated.data;
  const from =
    process.env.RESEND_FROM_EMAIL || "Ability to Thrive <onboarding@resend.dev>";
  const to = process.env.RESEND_TO_EMAIL || "delivered@resend.dev";

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: testimonialData.email,
    subject: `New testimonial from ${testimonialData.name}`,
    html: buildTestimonialEmailHtml(testimonialData),
    text: buildTestimonialEmailText(testimonialData),
  });

  if (error) {
    return {
      error: error.message || "Failed to send testimonial email.",
      status: 500,
    };
  }

  return {
    data,
    status: 200,
  };
}
