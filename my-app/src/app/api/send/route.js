import { sendEnquiryEmail } from "../../../lib/send-enquiry-email";

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await sendEnquiryEmail(payload);

    if (result.error) {
      return Response.json({ error: result.error }, { status: result.status });
    }

    return Response.json(result.data, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error.message || "Unable to send enquiry." },
      { status: 500 }
    );
  }
}
