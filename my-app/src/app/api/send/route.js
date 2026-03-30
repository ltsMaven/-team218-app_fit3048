import { sendEnquiryEmail } from "../../../lib/send-enquiry-email";

export async function POST(request) {
  try {
    const payload = await request.json();

    const { captchaToken, ...emailPayload } = payload;

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


    const result = await sendEnquiryEmail(emailPayload);

    if (result.error) {
      return Response.json(
        { error: result.error },
        { status: result.status || 400 }
      );
    }

    return Response.json(result.data, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error.message || "Unable to send enquiry." },
      { status: 500 }
    );
  }
}
