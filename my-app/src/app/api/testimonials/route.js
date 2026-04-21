import { sendTestimonialEmail } from "@/lib/send-testimonial-email";
import { saveTestimonialSubmission } from "@/lib/testimonial-submissions";

export async function POST(request) {
  try {
    const payload = await request.json();
    const { captchaToken } = payload;

    if (!captchaToken) {
      return Response.json(
        { error: "Please complete the reCAPTCHA verification." },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      return Response.json(
        { error: "Server configuration error: missing reCAPTCHA secret key." },
        { status: 500 }
      );
    }

    const verifyResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: captchaToken,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return Response.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    const saved = await saveTestimonialSubmission(payload);

    if (saved.error) {
      return Response.json(
        { error: saved.error },
        { status: saved.status || 400 }
      );
    }

    const notification = await sendTestimonialEmail(payload);

    if (notification.error) {
      console.warn("Testimonial saved but email notification failed:", {
        error: notification.error,
      });
    }

    return Response.json(
      {
        success: true,
        testimonial: saved.data,
        emailSent: !notification.error,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "Unable to submit testimonial." },
      { status: 500 }
    );
  }
}
