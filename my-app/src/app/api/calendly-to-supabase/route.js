import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getServerSupabaseClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

const SIGNATURE_TOLERANCE_SECONDS = 300;

function getCalendlyToken() {
  const token = process.env.CALENDLY_API_TOKEN;

  if (!token) {
    throw new Error("Missing CALENDLY_API_TOKEN environment variable.");
  }

  return token;
}

function getCalendlyWebhookSigningKey() {
  const signingKey =
    process.env.CALENDLY_WEBHOOK_SIGNING_KEY ||
    process.env.CALENDLY_WEBHOOK_SIGNING_SECRET;

  if (!signingKey) {
    throw new Error("Missing CALENDLY_WEBHOOK_SIGNING_KEY environment variable.");
  }

  return signingKey;
}

function parseCalendlySignatureHeader(header = "") {
  return header.split(",").reduce(
    (parts, item) => {
      const [key, value] = item.split("=").map((part) => part.trim());

      if (key === "t") {
        return {
          ...parts,
          timestamp: value,
        };
      }

      if (key === "v1" && value) {
        return {
          ...parts,
          signatures: [...parts.signatures, value],
        };
      }

      return parts;
    },
    { timestamp: "", signatures: [] }
  );
}

function timingSafeHexEqual(expected, received) {
  if (!/^[a-f0-9]+$/i.test(received)) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

function verifyCalendlyWebhookSignature(request, rawBody) {
  const signatureHeader = request.headers.get("calendly-webhook-signature");

  if (!signatureHeader) {
    return false;
  }

  const { timestamp, signatures } =
    parseCalendlySignatureHeader(signatureHeader);
  const timestampSeconds = Number(timestamp);

  if (
    !timestamp ||
    !Number.isFinite(timestampSeconds) ||
    signatures.length === 0
  ) {
    return false;
  }

  const currentSeconds = Math.floor(Date.now() / 1000);

  if (
    Math.abs(currentSeconds - timestampSeconds) > SIGNATURE_TOLERANCE_SECONDS
  ) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac("sha256", getCalendlyWebhookSigningKey())
    .update(signedPayload, "utf8")
    .digest("hex");

  return signatures.some((signature) =>
    timingSafeHexEqual(expectedSignature, signature)
  );
}

async function fetchCalendlyResource(uri) {
  const response = await fetch(uri, {
    headers: {
      Authorization: `Bearer ${getCalendlyToken()}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.title || data?.message || `Calendly request failed for ${uri}.`
    );
  }

  return data?.resource;
}

function extractCalendlyUris(body = {}) {
  if (body?.event === "invitee.created") {
    return {
      eventUri: body?.payload?.event || "",
      inviteeUri: body?.payload?.uri || "",
    };
  }

  return {
    eventUri: body?.eventUri || body?.payload?.event?.uri || "",
    inviteeUri: body?.inviteeUri || body?.payload?.invitee?.uri || "",
  };
}

async function buildAppointmentRecord(body) {
  const { eventUri, inviteeUri } = extractCalendlyUris(body);

  if (!eventUri || !inviteeUri) {
    throw new Error("Missing Calendly event or invitee URI.");
  }

  const [eventResource, inviteeResource] = await Promise.all([
    fetchCalendlyResource(eventUri),
    fetchCalendlyResource(inviteeUri),
  ]);

  return {
    client_name: inviteeResource?.name || "",
    client_email: inviteeResource?.email || "",
    appointment_time: eventResource?.start_time || "",
    service_type: eventResource?.name || "",
  };
}

function validateAppointmentRecord(record) {
  if (
    !record.client_name ||
    !record.client_email ||
    !record.appointment_time ||
    !record.service_type
  ) {
    throw new Error("Calendly response is missing appointment details.");
  }
}

async function appointmentExists(supabase, record) {
  const { data, error } = await supabase
    .from("appointments")
    .select("client_email")
    .eq("client_email", record.client_email)
    .eq("appointment_time", record.appointment_time)
    .eq("service_type", record.service_type)
    .limit(1);

  if (error) {
    throw new Error(`Supabase lookup failed: ${error.message}`);
  }

  return Array.isArray(data) && data.length > 0;
}

async function saveAppointment(record) {
  const supabase = getServerSupabaseClient();

  if (await appointmentExists(supabase, record)) {
    return { duplicate: true };
  }

  const { error } = await supabase.from("appointments").insert([record]);

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  return { duplicate: false };
}

export async function POST(request) {
  try {
    const rawBody = await request.text();

    if (!verifyCalendlyWebhookSignature(request, rawBody)) {
      return NextResponse.json(
        { error: "Invalid Calendly webhook signature." },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);

    if (body?.event && body.event !== "invitee.created") {
      return NextResponse.json({ ignored: true }, { status: 200 });
    }

    const record = await buildAppointmentRecord(body);
    validateAppointmentRecord(record);

    const result = await saveAppointment(record);

    return NextResponse.json(
      {
        success: true,
        duplicate: result.duplicate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Calendly sync failed:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Invalid JSON payload.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
